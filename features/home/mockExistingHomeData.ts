import type { Trip, TripMember } from "@/types";

/** Demo data for /dashboard?preview=existing — matches Figma "My Day Ones". */
export const MOCK_EXISTING_HOME_TRIP: Trip = {
  id: "preview-trip-my-day-ones",
  name: "My Day Ones",
  destination: "Mountain Retreat",
  startDate: "2026-10-20",
  endDate: "2026-10-22",
  baseCurrency: "NGN",
  baseCurrencyLockedAt: null,
  inviteToken: "preview-token",
  createdBy: "preview-user",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const MOCK_EXISTING_HOME_MEMBERS: TripMember[] = [
  {
    userId: "preview-m1",
    tripId: MOCK_EXISTING_HOME_TRIP.id,
    displayName: "Alex",
    avatarUrl: "/tabr/home/avatars/14.png",
    role: "organizer",
    joinedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    userId: "preview-m2",
    tripId: MOCK_EXISTING_HOME_TRIP.id,
    displayName: "Sam",
    avatarUrl: "/tabr/home/avatars/15.png",
    role: "member",
    joinedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    userId: "preview-m3",
    tripId: MOCK_EXISTING_HOME_TRIP.id,
    displayName: "Jordan",
    avatarUrl: "/tabr/home/avatars/18.png",
    role: "member",
    joinedAt: "2026-01-03T00:00:00.000Z",
  },
  {
    userId: "preview-m4",
    tripId: MOCK_EXISTING_HOME_TRIP.id,
    displayName: "Casey",
    avatarUrl: "/tabr/home/avatars/21.png",
    role: "member",
    joinedAt: "2026-01-04T00:00:00.000Z",
  },
  {
    userId: "preview-m5",
    tripId: MOCK_EXISTING_HOME_TRIP.id,
    displayName: "Riley",
    avatarUrl: "/tabr/home/avatars/14.png",
    role: "member",
    joinedAt: "2026-01-05T00:00:00.000Z",
  },
];

export function getMockExistingHomeMembersByTrip(): Record<string, TripMember[]> {
  return {
    [MOCK_EXISTING_HOME_TRIP.id]: MOCK_EXISTING_HOME_MEMBERS,
  };
}
