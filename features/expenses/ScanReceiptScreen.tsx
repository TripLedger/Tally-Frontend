"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Flashlight } from "lucide-react";
import {
  AuthBackButton,
  AuthStackHeader,
} from "@/features/auth";
import { cn } from "@/lib/utils";

type TorchConstraints = MediaTrackConstraints & {
  advanced?: Array<{ torch?: boolean }>;
};

const geistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type PermissionPhase = "prompt" | "granted" | "denied";

interface ScanReceiptScreenProps {
  groupId: string;
  outingId: string;
}

/**
 * Outing flow — Scan receipt (Figma).
 * Camera preview + flash toggle; iOS-style permission prompt before getUserMedia.
 */
export function ScanReceiptScreen({
  groupId,
  outingId,
}: ScanReceiptScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<PermissionPhase>("prompt");
  const [flashOn, setFlashOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  const backHref = `/trips/${groupId}/outings/${outingId}/expenses`;

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPhase("denied");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      const caps = track?.getCapabilities?.() as
        | (MediaTrackCapabilities & { torch?: boolean })
        | undefined;
      setTorchSupported(Boolean(caps?.torch));

      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        void video.play().catch(() => {
          /* autoplay can fail silently; preview still attaches */
        });
      });
    } catch {
      setPhase("denied");
      setTorchSupported(false);
    }
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  const onAllow = () => {
    setPhase("granted");
    void startCamera();
  };

  const onDeny = () => {
    setPhase("denied");
  };

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track || !torchSupported) return;

    const next = !flashOn;
    try {
      const constraints: TorchConstraints = {
        advanced: [{ torch: next }],
      };
      await track.applyConstraints(constraints);
      setFlashOn(next);
    } catch {
      /* device rejected torch */
    }
  };

  const showPermission = phase === "prompt";

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(1.5rem,var(--safe-bottom))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href={backHref} label="Back to add expense" />
      </div>

      <AuthStackHeader
        title="Scan receipt"
        subtitle="Align your camera with the code on the receipt"
      />

      <div className="mt-8 flex min-h-0 flex-1 flex-col items-center">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-[28px]",
            "aspect-[358/420] max-h-[min(52dvh,420px)]",
            "bg-[#9CA3AF]"
          )}
        >
          {phase === "granted" ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
              aria-label="Camera preview"
            />
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => void toggleFlash()}
          disabled={phase !== "granted" || !torchSupported}
          aria-label={flashOn ? "Turn flash off" : "Turn flash on"}
          aria-pressed={flashOn}
          className={cn(
            "mt-8 flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
            "bg-[#A3A3A3] text-white",
            "transition-[transform,background-color,opacity] duration-150",
            "active:scale-95",
            (phase !== "granted" || !torchSupported) && "opacity-70",
            flashOn && "bg-[#8B5CF6]",
            focusRing
          )}
        >
          <Flashlight
            className="h-6 w-6"
            strokeWidth={2}
            fill={flashOn ? "currentColor" : "none"}
            aria-hidden
          />
        </button>
      </div>

      {showPermission ? (
        <CameraPermissionDialog
          onAllowOnce={onAllow}
          onAllowWhileUsing={onAllow}
          onDeny={onDeny}
        />
      ) : null}
    </div>
  );
}

function CameraPermissionDialog({
  onAllowOnce,
  onAllowWhileUsing,
  onDeny,
}: {
  onAllowOnce: () => void;
  onAllowWhileUsing: () => void;
  onDeny: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/25 px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-permission-title"
    >
      <div
        className={cn(
          "w-full max-w-[270px] overflow-hidden rounded-[14px]",
          "bg-white/95 backdrop-blur-xl",
          "shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
        )}
      >
        <div className="px-4 pb-3.5 pt-5 text-center">
          <p
            id="camera-permission-title"
            className={cn(
              "text-[17px] font-semibold leading-[22px] tracking-[-0.02em]",
              "text-[#000000]"
            )}
          >
            Allow Tabr to take pictures and record video?
          </p>
        </div>

        <div className="flex flex-col">
          <PermissionAction onClick={onAllowOnce}>Allow Once</PermissionAction>
          <PermissionAction onClick={onAllowWhileUsing} bold>
            Allow While Using App
          </PermissionAction>
          <PermissionAction onClick={onDeny}>Don&apos;t Allow</PermissionAction>
        </div>
      </div>
    </div>
  );
}

function PermissionAction({
  children,
  onClick,
  bold = false,
}: {
  children: ReactNode;
  onClick: () => void;
  bold?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[44px] w-full items-center justify-center border-t border-[#3C3C4333]",
        "text-[17px] leading-[22px] text-[#007AFF]",
        "transition-colors active:bg-black/[0.04]",
        "focus-visible:outline-none focus-visible:bg-black/[0.04]",
        bold ? "font-semibold" : "font-normal"
      )}
    >
      {children}
    </button>
  );
}
