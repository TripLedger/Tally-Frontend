"use client";

import { create } from "zustand";

export interface CreateGroupDraft {
  name: string;
  baseCurrency: string;
}

const STORAGE_KEY = "tally_create_group_draft";

function readDraft(): CreateGroupDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CreateGroupDraft;
    if (!parsed?.name?.trim() || !parsed?.baseCurrency?.trim()) return null;
    return {
      name: parsed.name.trim(),
      baseCurrency: parsed.baseCurrency.trim(),
    };
  } catch {
    return null;
  }
}

function writeDraft(draft: CreateGroupDraft | null) {
  if (typeof window === "undefined") return;
  try {
    if (!draft) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // private mode / blocked storage
  }
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
