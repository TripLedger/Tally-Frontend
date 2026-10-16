import { create } from "zustand";
import type { ReactNode } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface BottomSheetState {
  isOpen: boolean;
  content: ReactNode | null;
  title?: string;
  height: "40" | "45" | "60" | "75";
  /** Light = current Figma chrome; dark = legacy Tally sheet. */
  variant: "light" | "dark";
}

interface UIState {
  bottomSheet: BottomSheetState;
  toasts: ToastItem[];
  openBottomSheet: (
    content: ReactNode,
    options?: {
      title?: string;
      height?: "40" | "45" | "60" | "75";
      variant?: "light" | "dark";
    }
  ) => void;
  closeBottomSheet: () => void;
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  bottomSheet: {
    isOpen: false,
    content: null,
    title: undefined,
    height: "60",
    variant: "dark",
  },
  toasts: [],
  openBottomSheet: (content, options) =>
    set({
      bottomSheet: {
        isOpen: true,
        content,
        title: options?.title,
        height: options?.height ?? "60",
        variant: options?.variant ?? "dark",
      },
    }),
  closeBottomSheet: () =>
    set({
      bottomSheet: {
        isOpen: false,
        content: null,
        title: undefined,
        height: "60",
        variant: "dark",
      },
    }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: crypto.randomUUID() },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useBottomSheet = () => useUIStore((s) => s.bottomSheet);
export const useToasts = () => useUIStore((s) => s.toasts);
export const useOpenBottomSheet = () =>
  useUIStore((s) => s.openBottomSheet);
export const useCloseBottomSheet = () =>
  useUIStore((s) => s.closeBottomSheet);
export const useAddToast = () => useUIStore((s) => s.addToast);
export const useRemoveToast = () => useUIStore((s) => s.removeToast);
