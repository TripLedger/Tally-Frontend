import type { Trip, TripMember } from "@/types";
import type { AuthUser } from "@/store/authStore";
import {
  fetchMembersForTrip,
  seedMemoryMember,
} from "@/lib/db/members";
import { emitMemberJoinedNotifications } from "@/lib/notifications/emit";

/** In-memory trips until the real backend ships. */
const memoryTrips = new Map<string, Trip>();
const memoryTripsByUser = new Map<string, Set<string>>();

function memoryUpsertTrip(trip: Trip, userId: string): void {
  memoryTrips.set(trip.id, trip);
  const owned = memoryTripsByUser.get(userId) ?? new Set<string>();
  owned.add(trip.id);
  memoryTripsByUser.set(userId, owned);
}

function memoryFetchTripsForUser(userId: string): Trip[] {
  const ids = memoryTripsByUser.get(userId);
  if (!ids?.size) return [];
  return [...ids]
    .map((id) => memoryTrips.get(id))
    .filter((trip): trip is Trip => Boolean(trip))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

function memoryFetchTrip(tripId: string): Trip | null {
  return memoryTrips.get(tripId) ?? null;
}

function memoryLookupByToken(token: string): Trip | null {
  const normalized = decodeURIComponent(token).trim();
  for (const trip of memoryTrips.values()) {
    if (trip.inviteToken === normalized) return trip;
  }
  return null;
}

export type JoinTripResult =
  | { ok: true; trip: Trip; members: TripMember[]; isNewMember: boolean }
  | { ok: false; error: "INVALID_TOKEN" };

/** Persist a freshly-created trip + organizer in memory. */
export async function persistTrip(
  trip: Trip,
  organizer: TripMember
): Promise<void> {
  memoryUpsertTrip(trip, trip.createdBy);
  seedMemoryMember(organizer);
}

/**
 * Join a trip via invite token.
 * Case 1: new member — writes MEMBER row.
 * Case 2: existing member — skips write, returns seamlessly.
 */
export async function joinTripViaToken(
  token: string,
  user: AuthUser
): Promise<JoinTripResult> {
  const normalized = decodeURIComponent(token).trim();
  const trip = memoryLookupByToken(normalized);
  if (!trip) {
    return { ok: false, error: "INVALID_TOKEN" };
  }

  const membersBefore = await fetchMembersForTrip(trip.id);
  const alreadyMember = membersBefore.some((m) => m.userId === user.id);
  const displayName = user.displayName || user.email;

  if (!alreadyMember) {
    seedMemoryMember({
      userId: user.id,
      tripId: trip.id,
      displayName,
      avatarUrl: user.avatarUrl,
      role: "member",
      joinedAt: new Date().toISOString(),
    });
    memoryUpsertTrip(trip, user.id);
  }

  const members = await fetchMembersForTrip(trip.id);

  if (!alreadyMember) {
    emitMemberJoinedNotifications({
      tripId: trip.id,
      tripName: trip.name,
      joiner: {
        userId: user.id,
        displayName,
        avatarUrl: user.avatarUrl,
      },
      members,
    });
  }

  return {
    ok: true,
    trip,
    members,
    isNewMember: !alreadyMember,
  };
}

export async function fetchTripsForUser(userId: string): Promise<Trip[]> {
  return memoryFetchTripsForUser(userId);
}

export async function fetchTripDetail(
  tripId: string
): Promise<{ trip: Trip | null; members: TripMember[] }> {
  const trip = memoryFetchTrip(tripId);
  const members = await fetchMembersForTrip(tripId);
  return { trip, members };
}
