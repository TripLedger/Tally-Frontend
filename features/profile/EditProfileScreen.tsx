"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Eye, EyeOff } from "lucide-react";
import {
  AuthBackButton,
  authFieldBorder,
  authFieldClass,
  authLabelClass,
  authStackCtaClass,
} from "@/features/auth";
import { getMemberInitial } from "@/lib/avatar-colors";
import { cn } from "@/lib/utils";
import { useAddToast, useAuthStore, useUser } from "@/store";
import { EditPhotoSheet } from "./EditPhotoSheet";
import { TakePhotoCamera } from "./TakePhotoCamera";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function stripHandle(handle?: string): string {
  return (handle ?? "").trim().replace(/^@+/, "");
}

/** Blob URLs die after refresh — only persist http(s)/data/relative avatars. */
function isPersistableAvatar(url?: string | null): boolean {
  if (!url) return false;
  if (url.startsWith("blob:")) return false;
  return (
    url.startsWith("data:") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read image"));
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

/**
 * Figma Edit profile — optional photo sheet, required name + username, Done.
 */
export function EditProfileScreen() {
  const router = useRouter();
  const user = useUser();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const isUpdating = useAuthStore((s) => s.isUpdatingProfile);
  const addToast = useAddToast();
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const initialName = user?.displayName?.trim() || "";
  const initialUsername =
    stripHandle(user?.handle) || stripHandle(user?.email?.split("@")[0]);
  const initialAvatar = isPersistableAvatar(user?.avatarUrl)
    ? (user?.avatarUrl as string)
    : null;

  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [usernameVisible, setUsernameVisible] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialAvatar
  );
  const [avatarDirty, setAvatarDirty] = useState(false);
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.avatarUrl?.startsWith("blob:")) {
      void updateProfile({ avatarUrl: null });
    }
  }, [user?.avatarUrl, updateProfile]);

  useEffect(() => {
    if (!user) return;
    setName((current) => (current ? current : user.displayName?.trim() || ""));
    setUsername((current) =>
      current
        ? current
        : stripHandle(user.handle) || stripHandle(user.email?.split("@")[0])
    );
    if (!avatarDirty) {
      setAvatarPreview(
        isPersistableAvatar(user.avatarUrl) ? (user.avatarUrl as string) : null
      );
    }
  }, [user, avatarDirty]);

  const nameTrimmed = name.trim();
  const usernameTrimmed = username.trim().replace(/^@+/, "");
  const nameValid = nameTrimmed.length >= 2;
  const usernameValid = usernameTrimmed.length >= 2;
  const hasPhoto = Boolean(avatarPreview);

  const dirty =
    nameTrimmed !== initialName ||
    usernameTrimmed !== initialUsername ||
    avatarDirty;

  const canSave =
    nameValid && usernameValid && dirty && !saving && !isUpdating;

  const photoInitial = useMemo(
    () => getMemberInitial(nameTrimmed || initialName || "T"),
    [nameTrimmed, initialName]
  );

  const applyPhotoFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      addToast({
        message: "Choose an image file for your photo.",
        variant: "error",
        duration: 2500,
      });
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAvatarPreview(dataUrl);
      setAvatarDirty(true);
    } catch {
      addToast({
        message: "Couldn't read that image. Try another one.",
        variant: "error",
        duration: 2500,
      });
    }
  };

  const onPhotoInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    await applyPhotoFile(file);
  };

  const onDeletePhoto = () => {
    setAvatarPreview(null);
    setAvatarDirty(true);
    setPhotoSheetOpen(false);
  };

  const onDone = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const ok = await updateProfile({
        displayName: nameTrimmed,
        handle: usernameTrimmed,
        ...(avatarDirty
          ? { avatarUrl: avatarPreview ?? null }
          : {}),
      });
      if (!ok) {
        addToast({
          message: "Couldn't update your profile. Please try again.",
          variant: "error",
        });
        return;
      }
      addToast({
        message: "Profile updated",
        variant: "success",
        duration: 2000,
      });
      router.push("/profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(2rem,calc(var(--safe-bottom)+1.5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/profile" label="Back to profile" />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">Edit profile</h1>

      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setPhotoSheetOpen(true)}
          aria-label="Edit photo"
          className={cn(
            "relative flex h-[96px] w-[96px] items-center justify-center overflow-hidden",
            "rounded-full bg-[#EDE7F6] text-[#5921B5]",
            "transition-transform duration-150 active:scale-95",
            focusRing
          )}
        >
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="text-[36px] font-semibold leading-none text-[#5921B5]"
              aria-hidden
            >
              {photoInitial}
            </span>
          )}

          <span
            className={cn(
              "absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center",
              "rounded-full bg-[#5921B5] text-white",
              "shadow-[0_2px_6px_rgba(89,33,181,0.35)]"
            )}
            aria-hidden
          >
            <Camera className="h-4 w-4" strokeWidth={2} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setPhotoSheetOpen(true)}
          className={cn(
            "mt-3 text-[14px] font-medium leading-5 text-[#15131A]",
            focusRing,
            "rounded-md px-1"
          )}
        >
          Edit photo
        </button>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void onPhotoInputChange(event)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="edit-profile-name" className={authLabelClass}>
            Name
          </label>
          <input
            id="edit-profile-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className={cn(
              authFieldClass,
              authFieldBorder(!nameValid && name.length > 0),
              focusRing
            )}
          />
        </div>

        <div>
          <label htmlFor="edit-profile-username" className={authLabelClass}>
            Username
          </label>
          <div className="relative">
            <input
              id="edit-profile-username"
              type={usernameVisible ? "text" : "password"}
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="username"
              className={cn(
                authFieldClass,
                authFieldBorder(!usernameValid && username.length > 0),
                "pr-12",
                focusRing
              )}
            />
            <button
              type="button"
              onClick={() => setUsernameVisible((v) => !v)}
              aria-label={usernameVisible ? "Hide username" : "Show username"}
              className={cn(
                "absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2",
                "items-center justify-center rounded-full text-[#8E8E93]",
                "transition-colors hover:text-[#15131A]",
                focusRing
              )}
            >
              {usernameVisible ? (
                <Eye className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              ) : (
                <EyeOff className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 shrink-0">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => void onDone()}
          className={cn("w-full", authStackCtaClass(canSave), focusRing)}
        >
          {saving || isUpdating ? "Saving…" : "Done"}
        </button>
      </div>

      <EditPhotoSheet
        open={photoSheetOpen}
        hasPhoto={hasPhoto}
        onClose={() => setPhotoSheetOpen(false)}
        onTakePhoto={() => {
          setPhotoSheetOpen(false);
          setCameraOpen(true);
        }}
        onChoosePhoto={() => {
          setPhotoSheetOpen(false);
          galleryInputRef.current?.click();
        }}
        onDeletePhoto={onDeletePhoto}
      />

      <TakePhotoCamera
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(dataUrl) => {
          setAvatarPreview(dataUrl);
          setAvatarDirty(true);
          setCameraOpen(false);
        }}
        onUnavailable={() => {
          setCameraOpen(false);
          addToast({
            message:
              "No camera available. Use Choose photo to pick from your gallery.",
            variant: "info",
            duration: 3000,
          });
        }}
      />
    </div>
  );
}
