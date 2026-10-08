"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import { cn } from "@/lib/utils";
import {
  getSurveyQuestion,
  SURVEY_TOTAL_STEPS,
  type SurveyAnswerValue,
  type SurveyQuestion,
} from "./surveyQuestions";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function isAnswerComplete(
  question: SurveyQuestion,
  answer: SurveyAnswerValue | undefined
): boolean {
  if (answer == null) return false;
  if (question.type === "stars") {
    return typeof answer === "number" && answer >= 1 && answer <= 5;
  }
  if (question.type === "single") {
    return typeof answer === "string" && answer.length > 0;
  }
  if (question.type === "multi") {
    return Array.isArray(answer) && answer.length > 0;
  }
  return typeof answer === "string" && answer.trim().length > 0;
}

/**
/** 10-step review survey wizard (Figma Review Question frames). */
export function ReviewSurveyScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, SurveyAnswerValue>>({});

  const question = getSurveyQuestion(step);
  const answer = question ? answers[question.id] : undefined;
  const canContinue = question ? isAnswerComplete(question, answer) : false;
  const progressPct = (step / SURVEY_TOTAL_STEPS) * 100;

  const setAnswer = (value: SurveyAnswerValue) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const onBack = () => {
    if (step <= 1) {
      router.push("/profile/review");
      return;
    }
    setStep((s) => s - 1);
  };

  const onContinue = () => {
    if (!question || !canContinue) return;
    if (step >= SURVEY_TOTAL_STEPS) {
      router.push("/profile/review/survey/complete");
      return;
    }
    setStep((s) => s + 1);
  };

  if (!question) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(2.5rem,calc(var(--safe-bottom)+1.75rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <header className="shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-[#15131A]",
              "transition-opacity active:opacity-70",
              focusRing
            )}
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <span className="text-[14px] font-medium tabular-nums text-[#716D7D]">
            {step}/{SURVEY_TOTAL_STEPS}
          </span>
        </div>

        <div
          className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#EFEFEF]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={SURVEY_TOTAL_STEPS}
          aria-valuenow={step}
          aria-label={`Survey step ${step} of ${SURVEY_TOTAL_STEPS}`}
        >
          <div
            className="h-full rounded-full bg-[#8B5CF6] transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        <h1 className="text-[24px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#15131A]">
          {question.title}
        </h1>

        {(question.type === "multi" || question.type === "text") &&
        question.hint ? (
          <p className="mt-2 text-[14px] font-normal leading-5 text-[#716D7D]">
            {question.hint}
          </p>
        ) : null}

        <div className="mt-8 flex-1">
          {question.type === "stars" ? (
            <StarsAnswer
              label={question.ratingLabel ?? "Your overall rating"}
              value={typeof answer === "number" ? answer : 0}
              onChange={setAnswer}
            />
          ) : null}

          {question.type === "single" ? (
            <ChoiceList
              mode="single"
              options={question.options}
              selected={typeof answer === "string" ? [answer] : []}
              onSelect={(id) => setAnswer(id)}
            />
          ) : null}

          {question.type === "multi" ? (
            <ChoiceList
              mode="multi"
              options={question.options}
              selected={Array.isArray(answer) ? answer : []}
              onSelect={(id) => {
                const current = Array.isArray(answer) ? answer : [];
                setAnswer(
                  current.includes(id)
                    ? current.filter((x) => x !== id)
                    : [...current, id]
                );
              }}
            />
          ) : null}

          {question.type === "text" ? (
            <textarea
              value={typeof answer === "string" ? answer : ""}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={question.placeholder}
              rows={6}
              className={cn(
                "min-h-[160px] w-full resize-none rounded-[16px] border border-[#E5E5EA] bg-white",
                "px-4 py-3.5 text-[15px] font-normal leading-6 text-[#15131A]",
                "placeholder:text-[#AEAEB2]",
                "outline-none transition-shadow",
                "focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20",
                focusRing
              )}
            />
          ) : null}
        </div>

        <div className="mt-auto shrink-0 pt-8">
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className={cn("w-full", authStackCtaClass(canContinue), focusRing)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function StarsAnswer({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[14px] font-normal leading-5 text-[#716D7D]">{label}</p>
      <div
        className="flex items-center justify-center gap-2.5"
        role="radiogroup"
        aria-label={label}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const star = index + 1;
          const filled = star <= value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === value}
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
              onClick={() => onChange(star)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                "transition-transform duration-150 active:scale-95",
                focusRing
              )}
            >
              <Star
                className={cn(
                  "h-8 w-8",
                  filled
                    ? "fill-[#F5A623] text-[#F5A623]"
                    : "fill-transparent text-[#F5A623]"
                )}
                strokeWidth={1.75}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceList({
  mode,
  options,
  selected,
  onSelect,
}: {
  mode: "single" | "multi";
  options: readonly { id: string; label: string }[];
  selected: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-3" role={mode === "single" ? "radiogroup" : "group"}>
      {options.map((option) => {
        const active = selected.includes(option.id);
        return (
          <li key={option.id}>
            <button
              type="button"
              role={mode === "single" ? "radio" : "checkbox"}
              aria-checked={active}
              onClick={() => onSelect(option.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-[16px] border bg-white px-4 py-4 text-left",
                "transition-colors duration-150",
                active
                  ? "border-[#C5ADFA] bg-[#FBF9FF]"
                  : "border-[#E5E5EA] hover:border-[#D4D4D8]",
                focusRing
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  active ? "border-[#8B5CF6]" : "border-[#C7C7CC]"
                )}
                aria-hidden
              >
                {active ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-normal leading-5 text-[#15131A]">
                {option.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
