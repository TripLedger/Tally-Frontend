"use client";

import type { ReactNode } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ToastContainer } from "@/components/ui/Toast";
import { AuthSessionHydrator } from "@/features/auth";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthSessionHydrator />
      {children}
      <BottomSheet />
      <ToastContainer />
    </>
  );
}
