"use client";

import { create } from "zustand";
import {
  readLocalJson,
  removeLocalJson,
  writeLocalJson,
} from "@/lib/db/local-persist";

/**
 * Client-side drafts for created outings (add-trip flow).
 * Persisted in localStorage until the backend owns itinerary records.
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

const STORAGE_KEY = "tally_created_trip_drafts_v1";
const LEGACY_STORAGE_KEY = "tally_created_trip_draft";

type PersistedDrafts = {
  byId: Record<string, CreatedTripDraft>;
  latestId: string | null;
};

function isValidDraft(parsed: unknown): parsed is CreatedTripDraft {
  if (!parsed || typeof parsed !== "object") return false;
  const d = parsed as CreatedTripDraft;
  return Boolean(d.id && d.name && d.groupId);
}

function readAll(): PersistedDrafts {
  if (typeof window === "undefined") return { byId: {}, latestId: null };

  const saved = readLocalJson<PersistedDrafts>(STORAGE_KEY);
  if (saved?.byId && typeof saved.byId === "object") {
    const byId: Record<string, CreatedTripDraft> = {};
    for (const [id, draft] of Object.entries(saved.byId)) {
      if (isValidDraft(draft)) byId[id] = draft;
    }
    const latestId =
      saved.latestId && byId[saved.latestId] ? saved.latestId : null;
    return { byId, latestId };
  }

  // Migrate single draft from sessionStorage / old local key.
  try {
    const legacy =
      localStorage.getItem(LEGACY_STORAGE_KEY) ??
      sessionStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as CreatedTripDraft;
      if (isValidDraft(parsed)) {
        const migrated: PersistedDrafts = {
          byId: { [parsed.id]: parsed },
          latestId: parsed.id,
        };
        writeLocalJson(STORAGE_KEY, migrated);
        removeLocalJson(LEGACY_STORAGE_KEY);
        try {
          sessionStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch {
          // ignore
        }
        return migrated;
      }
    }
  } catch {
    // ignore
  }

  return { byId: {}, latestId: null };
}

function writeAll(data: PersistedDrafts) {
  writeLocalJson(STORAGE_KEY, data);
}

interface CreatedTripDraftState {
  draftsById: Record<string, CreatedTripDraft>;
  /** Most recently created/updated draft (back-compat for single-draft callers). */
  draft: CreatedTripDraft | null;
  setDraft: (draft: CreatedTripDraft) => void;
  clearDraft: () => void;
  hydrateDraft: () => CreatedTripDraft | null;
  getDraftById: (id: string) => CreatedTripDraft | null;
  draftsForGroup: (groupId: string) => CreatedTripDraft[];
}

export const useCreatedTripDraftStore = create<CreatedTripDraftState>(
  (set, get) => ({
    draftsById: {},
    draft: null,
    setDraft: (draft) => {
      const next = {
        byId: { ...get().draftsById, [draft.id]: draft },
        latestId: draft.id,
      };
      writeAll(next);
      set({ draftsById: next.byId, draft });
    },
    clearDraft: () => {
      removeLocalJson(STORAGE_KEY);
      removeLocalJson(LEGACY_STORAGE_KEY);
      try {
        sessionStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        // ignore
      }
      set({ draftsById: {}, draft: null });
    },
    hydrateDraft: () => {
      const { byId, latestId } = readAll();
      const draft = (latestId && byId[latestId]) || null;
      set({ draftsById: byId, draft });
      return draft;
    },
    getDraftById: (id) => {
      const current = get().draftsById[id];
      if (current) return current;
      const { byId, latestId } = readAll();
      set({
        draftsById: byId,
        draft: (latestId && byId[latestId]) || null,
      });
      return byId[id] ?? null;
    },
    draftsForGroup: (groupId) => {
      const byId = Object.keys(get().draftsById).length
        ? get().draftsById
        : readAll().byId;
      return Object.values(byId)
        .filter((d) => d.groupId === groupId)
        .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    },
  })
);
