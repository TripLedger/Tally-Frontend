/** Password complexity rules for signup (own passwords + suggestions). */

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRuleId =
  | "length"
  | "uppercase"
  | "lowercase"
  | "number"
  | "special";

export interface PasswordRule {
  id: PasswordRuleId;
  label: string;
  test: (password: string) => boolean;
}

/** Special chars include underscore and common symbols. */
const SPECIAL_CHAR = /[^A-Za-z0-9]/;

export const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (p) => p.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "One number",
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "One special character (e.g. _ ! @ #)",
    test: (p) => SPECIAL_CHAR.test(p),
  },
];

export function getPasswordRuleStatus(password: string) {
  return passwordRules.map((rule) => ({
    ...rule,
    met: rule.test(password),
  }));
}

export function isPasswordComplex(password: string) {
  return passwordRules.every((rule) => rule.test(password));
}

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SPECIAL = "_!@#$%&*";

function pick(charset: string, random: () => number) {
  return charset[Math.floor(random() * charset.length)]!;
}

function shuffle(chars: string[], random: () => number) {
  const next = [...chars];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

/** Cryptographically strong suggestion that always meets complexity rules. */
export function generateStrongPassword(length = 14): string {
  const random = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! / 2 ** 32;
  };

  const required = [
    pick(UPPER, random),
    pick(LOWER, random),
    pick(DIGITS, random),
    pick(SPECIAL, random),
  ];

  const all = UPPER + LOWER + DIGITS + SPECIAL;
  while (required.length < length) {
    required.push(pick(all, random));
  }

  return shuffle(required, random).join("");
}
