import type { Trip, TripMember } from "@/types";
import type { AuthUser } from "@/store/authStore";
import {
  fetchMembersForTrip,
  seedMemoryMember,
} from "@/lib/db/members";
import { emitMemberJoinedNotifications } from "@/lib/notifications/emit";
import {
  readLocalJson,
  removeLocalJson,
  writeLocalJson,
} from "@/lib/db/local-persist";

const TRIPS_STORAGE_KEY = "tabr_mock_trips_v1";

type PersistedTrips = {
  trips: Record<string, Trip>;
  byUser: Record<string, string[]>;
};

/** In-memory trips + localStorage mirror until the real backend ships. */
const memoryTrips = new Map<string, Trip>();
const memoryTripsByUser = new Map<string, Set<string>>();
let tripsHydrated = false;

function hydrateTripsFromLocal(): void {
  if (tripsHydrated || typeof window === "undefined") return;
  tripsHydrated = true;

  const saved = readLocalJson<PersistedTrips>(TRIPS_STORAGE_KEY);
  if (!saved?.trips) return;

  for (const [id, trip] of Object.entries(saved.trips)) {
    if (trip?.id) memoryTrips.set(id, trip);
  }
  for (const [userId, ids] of Object.entries(saved.byUser ?? {})) {
    memoryTripsByUser.set(userId, new Set(ids.filter((id) => memoryTrips.has(id))));
  }
}

function persistTripsToLocal(): void {
  if (typeof window === "undefined") return;

  const trips: Record<string, Trip> = {};
  for (const [id, trip] of memoryTrips.entries()) {
    trips[id] = trip;
  }
  const byUser: Record<string, string[]> = {};
  for (const [userId, ids] of memoryTripsByUser.entries()) {
    byUser[userId] = [...ids];
  }
  writeLocalJson(TRIPS_STORAGE_KEY, { trips, byUser } satisfies PersistedTrips);
}

function memoryUpsertTrip(trip: Trip, userId: string): void {
  hydrateTripsFromLocal();
  memoryTrips.set(trip.id, trip);
  const owned = memoryTripsByUser.get(userId) ?? new Set<string>();
  owned.add(trip.id);
  memoryTripsByUser.set(userId, owned);
  persistTripsToLocal();
}

function memoryFetchTripsForUser(userId: string): Trip[] {
  hydrateTripsFromLocal();
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
  hydrateTripsFromLocal();
  return memoryTrips.get(tripId) ?? null;
}

function memoryLookupByToken(token: string): Trip | null {
  hydrateTripsFromLocal();
  const normalized = decodeURIComponent(token).trim();
  for (const trip of memoryTrips.values()) {
    if (trip.inviteToken === normalized) return trip;
  }
  return null;
}

/** Clear persisted + in-memory trips (e.g. on sign out). */
export function clearPersistedTrips(): void {
  memoryTrips.clear();
  memoryTripsByUser.clear();
  tripsHydrated = true;
  removeLocalJson(TRIPS_STORAGE_KEY);
}

export type JoinTripResult =
  | { ok: true; trip: Trip; members: TripMember[]; isNewMember: boolean }
  | { ok: false; error: "INVALID_TOKEN" };

/** Persist a freshly-created trip + organizer (memory + localStorage). */
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
