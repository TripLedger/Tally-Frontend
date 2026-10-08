"use client";

import { create } from "zustand";
import {
  readLocalJson,
  removeLocalJson,
  writeLocalJson,
} from "@/lib/db/local-persist";

export interface CreateGroupDraft {
  name: string;
  baseCurrency: string;
}

const STORAGE_KEY = "tally_create_group_draft";

function readDraft(): CreateGroupDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const fromLocal = readLocalJson<CreateGroupDraft>(STORAGE_KEY);
    if (fromLocal?.name?.trim() && fromLocal?.baseCurrency?.trim()) {
      return {
        name: fromLocal.name.trim(),
        baseCurrency: fromLocal.baseCurrency.trim(),
      };
    }
    // Migrate from sessionStorage if present.
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CreateGroupDraft;
    if (!parsed?.name?.trim() || !parsed?.baseCurrency?.trim()) return null;
    const draft = {
      name: parsed.name.trim(),
      baseCurrency: parsed.baseCurrency.trim(),
    };
    writeLocalJson(STORAGE_KEY, draft);
    sessionStorage.removeItem(STORAGE_KEY);
    return draft;
  } catch {
    return null;
  }
}

function writeDraft(draft: CreateGroupDraft | null) {
  if (typeof window === "undefined") return;
  if (!draft) {
    removeLocalJson(STORAGE_KEY);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return;
  }
  writeLocalJson(STORAGE_KEY, draft);
}

interface CreateGroupDraftState {
  draft: CreateGroupDraft | null;
  setDraft: (draft: CreateGroupDraft) => void;
  clearDraft: () => void;
  hydrateDraft: () => CreateGroupDraft | null;
}

/** Holds name + currency between Create group → Upload cover. */
export const useCreateGroupDraftStore = create<CreateGroupDraftState>(
  (set) => ({
    draft: null,
    setDraft: (draft) => {
      writeDraft(draft);
      set({ draft });
    },
    clearDraft: () => {
      writeDraft(null);
      set({ draft: null });
    },
    hydrateDraft: () => {
      const draft = readDraft();
      set({ draft });
      return draft;
    },
  })
);
