import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ONBOARDING_SLIDE_COUNT } from "@/features/onboarding/onboardingSlides";

interface OnboardingState {
  activeSlide: number;
  introCompleted: boolean;
  setActiveSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  markIntroCompleted: () => void;
  resetIntro: () => void;
}

function clampSlide(index: number): number {
  return Math.max(0, Math.min(index, ONBOARDING_SLIDE_COUNT - 1));
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      activeSlide: 0,
      introCompleted: false,

      setActiveSlide: (index) => set({ activeSlide: clampSlide(index) }),

      nextSlide: () => {
        const { activeSlide } = get();
        set({ activeSlide: clampSlide(activeSlide + 1) });
      },

      prevSlide: () => {
        const { activeSlide } = get();
        set({ activeSlide: clampSlide(activeSlide - 1) });
      },

      markIntroCompleted: () => set({ introCompleted: true }),

      resetIntro: () => set({ activeSlide: 0, introCompleted: false }),
    }),
    {
      name: "tabr-onboarding",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        introCompleted: state.introCompleted,
      }),
    }
  )
);

export const useActiveOnboardingSlide = () =>
  useOnboardingStore((s) => s.activeSlide);

export const useIntroCompleted = () =>
  useOnboardingStore((s) => s.introCompleted);
