"use client";

import type { ReactNode } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ToastContainer } from "@/components/ui/Toast";
import { AuthSessionHydrator } from "@/features/auth";
import { LocaleHydrator } from "./LocaleHydrator";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthSessionHydrator />
      <LocaleHydrator />
      {children}
      <BottomSheet />
      <ToastContainer />
    </>
  );
}
