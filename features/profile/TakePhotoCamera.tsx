"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

interface TakePhotoCameraProps {
  open: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  onUnavailable: () => void;
}

/**
 * In-app camera for profile Take photo — uses getUserMedia (user-facing).
 * Desktop browsers ignore <input capture>, so this is required for a real camera.
 */
export function TakePhotoCamera({
  open,
  onClose,
  onCapture,
  onUnavailable,
}: TakePhotoCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(true);
      onUnavailable();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      setReady(true);
      setError(false);

      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        void video.play().catch(() => {
          /* preview may still attach */
        });
      });
    } catch {
      setError(true);
      setReady(false);
      onUnavailable();
    }
  }, [onUnavailable]);

  useEffect(() => {
    if (!open) {
      stopStream();
      setReady(false);
      setError(false);
      return;
    }
    void startCamera();
    return () => stopStream();
  }, [open, startCamera, stopStream]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !ready || video.videoWidth === 0) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror selfie so it matches the preview.
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    stopStream();
    onCapture(dataUrl);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black"
      role="dialog"
      aria-modal
      aria-label="Take profile photo"
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-between px-4",
          "pt-[calc(max(var(--safe-top),47px)+0.75rem)]"
        )}
      >
        <button
          type="button"
          onClick={() => {
            stopStream();
            onClose();
          }}
          aria-label="Close camera"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full",
            "bg-white/15 text-white",
            focusRing
          )}
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
        <p className="text-[15px] font-semibold text-white">Take photo</p>
        <span className="w-11" aria-hidden />
      </div>

      <div className="relative mx-auto mt-6 flex w-full max-w-md flex-1 items-center justify-center px-5">
        <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[#1C1C1E]">
          {error ? (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <p className="text-[14px] font-normal leading-5 text-white/80">
                Camera unavailable on this device
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="h-full w-full scale-x-[-1] object-cover"
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex shrink-0 flex-col items-center gap-3 px-5",
          "pb-[max(2rem,calc(var(--safe-bottom)+1.5rem))] pt-6"
        )}
      >
        <button
          type="button"
          disabled={!ready || error}
          onClick={capture}
          aria-label="Capture photo"
          className={cn(
            "flex h-[72px] w-[72px] items-center justify-center rounded-full",
            "border-[3px] border-white bg-white/20",
            "transition-transform active:scale-95",
            "disabled:opacity-40",
            focusRing
          )}
        >
          <span className="h-14 w-14 rounded-full bg-white" aria-hidden />
        </button>
        <p className="text-[13px] font-normal text-white/70">
          {ready ? "Tap to capture" : error ? "Try Choose photo instead" : "Starting camera…"}
        </p>
      </div>
    </div>
  );
}
