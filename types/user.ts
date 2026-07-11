export type AuthProvider = "credentials" | "google";

export interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  homeCurrency: string;
  avatarUrl?: string;
  passwordHash?: string;
  providers: AuthProvider[];
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  displayName?: string;
  homeCurrency?: string;
  avatarUrl?: string;
  passwordHash?: string;
  providers: AuthProvider[];
  onboardingComplete?: boolean;
}

export interface UpdateUserInput {
  displayName?: string;
  homeCurrency?: string;
  avatarUrl?: string;
  passwordHash?: string;
  providers?: AuthProvider[];
  onboardingComplete?: boolean;
}
