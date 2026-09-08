"use client";

import { create } from "zustand";

/**
 * Client-side draft for a just-created outing (add-trip flow).
 * Stands in until the backend persists itinerary / outing records.
 */
export interface CreatedTripDraft {
  id: string;
  name: string;
  groupId: string;
  groupName: string;
  friendCount: number;
  avatarSrcs: string[];
  placeId: string;
  placeName: string;
  area: string;
  city: string;
  rating: number;
  reviewCount: number;
  priceLabel: string;
  imageSrc: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** 24h HH:mm */
  time: string;
  address: string;
}

const STORAGE_KEY = "tally_created_trip_draft";

function readDraft(): CreatedTripDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CreatedTripDraft;
    if (!parsed?.id || !parsed?.name || !parsed?.groupId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeDraft(draft: CreatedTripDraft | null) {
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

interface CreatedTripDraftState {
  draft: CreatedTripDraft | null;
  setDraft: (draft: CreatedTripDraft) => void;
  clearDraft: () => void;
  hydrateDraft: () => CreatedTripDraft | null;
  getDraftById: (id: string) => CreatedTripDraft | null;
}

export const useCreatedTripDraftStore = create<CreatedTripDraftState>(
  (set, get) => ({
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
    getDraftById: (id) => {
      const current = get().draft ?? readDraft();
      if (current?.id === id) {
        if (!get().draft) set({ draft: current });
        return current;
      }
      return null;
    },
  })
);
