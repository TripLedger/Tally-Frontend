import {
  readLocalJson,
  removeLocalJson,
  writeLocalJson,
} from "@/lib/db/local-persist";

const STORAGE_KEY = "tabr_app_review_v1";

/** Don't re-prompt for two weeks after dismiss / last show. */
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
/** Soft cap so we never nag forever if they keep dismissing. */
const MAX_PROMPTS = 5;

export type AppReviewStatus = "idle" | "dismissed" | "completed";

export type AppReviewState = {
  status: AppReviewStatus;
  /** Last time the modal was shown (or dismissed). */
  lastPromptAt: number | null;
  promptCount: number;
  rating?: number;
};

const DEFAULT_STATE: AppReviewState = {
  status: "idle",
  lastPromptAt: null,
  promptCount: 0,
};

export function readAppReviewState(): AppReviewState {
  const saved = readLocalJson<Partial<AppReviewState>>(STORAGE_KEY);
  if (!saved) return { ...DEFAULT_STATE };
  return {
    status:
      saved.status === "completed" || saved.status === "dismissed"
        ? saved.status
        : "idle",
    lastPromptAt:
      typeof saved.lastPromptAt === "number" ? saved.lastPromptAt : null,
    promptCount:
      typeof saved.promptCount === "number" ? saved.promptCount : 0,
    rating: typeof saved.rating === "number" ? saved.rating : undefined,
  };
}

function writeAppReviewState(state: AppReviewState): void {
  writeLocalJson(STORAGE_KEY, state);
}

/** True when an existing-user prompt is allowed (not completed, not in snooze). */
export function shouldPromptAppReview(
  state: AppReviewState = readAppReviewState()
): boolean {
  if (state.status === "completed") return false;
  if (state.promptCount >= MAX_PROMPTS) return false;
  if (
    state.lastPromptAt != null &&
    Date.now() - state.lastPromptAt < SNOOZE_MS
  ) {
    return false;
  }
  return true;
}

/** Record that we showed the modal — starts the snooze window. */
export function markAppReviewPromptShown(): AppReviewState {
  const prev = readAppReviewState();
  if (prev.status === "completed") return prev;
  const next: AppReviewState = {
    ...prev,
    lastPromptAt: Date.now(),
    promptCount: prev.promptCount + 1,
  };
  writeAppReviewState(next);
  return next;
}

export function markAppReviewDismissed(): AppReviewState {
  const prev = readAppReviewState();
  const next: AppReviewState = {
    ...prev,
    status: "dismissed",
    lastPromptAt: Date.now(),
  };
  writeAppReviewState(next);
  return next;
}

/** User finished the flow — never prompt again. */
export function markAppReviewCompleted(rating: number): AppReviewState {
  const next: AppReviewState = {
    status: "completed",
    lastPromptAt: Date.now(),
    promptCount: readAppReviewState().promptCount,
    rating,
  };
  writeAppReviewState(next);
  return next;
}

export function clearAppReviewState(): void {
  removeLocalJson(STORAGE_KEY);
}
