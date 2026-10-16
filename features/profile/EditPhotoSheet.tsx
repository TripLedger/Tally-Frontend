"use client";

import { Camera, ImageIcon, Trash2 } from "lucide-react";
import { LightHomeOverlay } from "@/features/home";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface EditPhotoSheetProps {
  open: boolean;
  hasPhoto: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChoosePhoto: () => void;
  onDeletePhoto: () => void;
}

function OptionRow({
  label,
  icon: Icon,
  onClick,
  destructive = false,
}: {
  label: string;
  icon: typeof Camera;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-5 py-3.5 text-left",
        "transition-colors hover:bg-[#FAFAFA] active:bg-[#F5F5F7]",
        focusRing
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          destructive ? "text-[#E11D48]" : "text-[#15131A]"
        )}
        strokeWidth={1.75}
        aria-hidden
      />
      <span
        className={cn(
          "text-[16px] font-medium leading-6",
          destructive ? "text-[#E11D48]" : "text-[#15131A]"
        )}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Standard photo actions — Take / Choose / Delete (when a photo exists).
 */
export function EditPhotoSheet({
  open,
  hasPhoto,
  onClose,
  onTakePhoto,
  onChoosePhoto,
  onDeletePhoto,
}: EditPhotoSheetProps) {
  return (
    <LightHomeOverlay
      open={open}
      onClose={onClose}
      ariaLabel="Edit photo options"
      variant="sheet"
    >
      <div className="px-1 pb-[max(0.75rem,var(--safe-bottom))] pt-2">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#E5E5EA]" aria-hidden />
        <p className="px-5 pb-1 text-[13px] font-medium text-[#8E8E93]">
          Profile photo
        </p>

        <OptionRow
          label="Take photo"
          icon={Camera}
          onClick={onTakePhoto}
        />
        <OptionRow
          label="Choose photo"
          icon={ImageIcon}
          onClick={onChoosePhoto}
        />
        {hasPhoto ? (
          <>
            <div className="mx-5 my-1 h-px bg-[#F0EEF5]" aria-hidden />
            <OptionRow
              label="Delete photo"
              icon={Trash2}
              onClick={onDeletePhoto}
              destructive
            />
          </>
        ) : null}

        <div className="mt-2 px-4">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex h-12 w-full items-center justify-center rounded-full",
              "bg-[#F3F3F5] text-[16px] font-semibold text-[#15131A]",
              "transition-transform active:scale-[0.98]",
              focusRing
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </LightHomeOverlay>
  );
}
