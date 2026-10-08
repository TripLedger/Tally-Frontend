/** App-review survey — Figma Review Question 1–10. */

export type SurveyAnswerValue = number | string | string[];

export type SurveyQuestion =
  | {
      id: string;
      step: number;
      type: "stars";
      title: string;
      ratingLabel?: string;
    }
  | {
      id: string;
      step: number;
      type: "single";
      title: string;
      options: readonly { id: string; label: string }[];
    }
  | {
      id: string;
      step: number;
      type: "multi";
      title: string;
      hint: string;
      options: readonly { id: string; label: string }[];
    }
  | {
      id: string;
      step: number;
      type: "text";
      title: string;
      hint?: string;
      placeholder: string;
    };

export const SURVEY_TOTAL_STEPS = 10;

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "split-experience",
    step: 1,
    type: "stars",
    title: "How was your experience splitting the bill?",
    ratingLabel: "Your overall rating",
  },
  {
    id: "trust-split",
    step: 2,
    type: "single",
    title: "Did you trust that Tabr calculated the split correctly?",
    options: [
      {
        id: "completely",
        label: "Completely — didn't need to double-check",
      },
      {
        id: "mostly",
        label: "Mostly — spot-checked one or two amounts",
      },
      {
        id: "not-sure",
        label: "Not sure — I'd verify before settling",
      },
      {
        id: "no",
        label: "No — something looked wrong",
      },
    ],
  },
  {
    id: "send-money",
    step: 3,
    type: "single",
    title: "If Tabr let you send money directly in-app right now, would you?",
    options: [
      { id: "yes-immediately", label: "Yes, immediately" },
      {
        id: "probably",
        label: "Probably, I'd want to see how it works first",
      },
      {
        id: "maybe",
        label: "Maybe, I'd need to trust the app more",
      },
      {
        id: "no-outside",
        label: "No - I'd prefer to transfer outside the app",
      },
    ],
  },
  {
    id: "send-money-trust-factors",
    step: 4,
    type: "multi",
    title: "If Tabr let you send money directly in-app right now, would you?",
    hint: "Select all that apply",
    options: [
      {
        id: "social-proof",
        label: "Seeing that other people I know use it",
      },
      {
        id: "bank-link",
        label: "Being able to link my bank account directly",
      },
      {
        id: "regulated",
        label: "Knowing Tabr is regulated or licensed",
      },
      {
        id: "protection",
        label: "An explanation of how money is protected",
      },
    ],
  },
  {
    id: "pot-likelihood",
    step: 5,
    type: "single",
    title: "How likely are you to use the Pot with your friend group?",
    options: [
      {
        id: "very-likely",
        label: "Very likely — I'd set it up for our next outing",
      },
      {
        id: "likely",
        label: "Likely — I can see us using it sometimes",
      },
      {
        id: "unlikely",
        label: "Unlikely — it feels like extra steps",
      },
      {
        id: "very-unlikely",
        label: "Very unlikely — we wouldn't use this",
      },
    ],
  },
  {
    id: "pot-blockers",
    step: 6,
    type: "text",
    title: "What would stop you or your group from using the Pot?",
    placeholder: "Type your review here.",
  },
  {
    id: "permanent-part",
    step: 7,
    type: "text",
    title:
      "What's one thing that would make Tabr a permanent part of how your group manages outings?",
    hint: "Be honest, we can handle it.",
    placeholder: "Type your review here.",
  },
  {
    id: "broken-or-confusing",
    step: 8,
    type: "text",
    title: "What was broken or confusing?",
    placeholder: "Type your review here.",
  },
  {
    id: "tell-a-friend",
    step: 9,
    type: "text",
    title: "How likely are you to tell a friend about Tabr?",
    placeholder: "Type your review here.",
  },
  {
    id: "hear-about-tabr",
    step: 10,
    type: "text",
    title: "How did you hear about Tabr?",
    placeholder: "Type your review here.",
  },
];

export function getSurveyQuestion(step: number): SurveyQuestion | null {
  return SURVEY_QUESTIONS.find((q) => q.step === step) ?? null;
}
