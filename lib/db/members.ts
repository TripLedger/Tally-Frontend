import { isDynamoConfigured } from "@/lib/dynamo-config";
import type { TripMember } from "@/types";
import {
  readLocalJson,
  removeLocalJson,
  writeLocalJson,
} from "@/lib/db/local-persist";

const MEMBERS_STORAGE_KEY = "tabr_mock_members_v1";

function memberMemoryKey(tripId: string, userId: string) {
  return `${tripId}#${userId}`;
}

const memoryMembers = new Map<string, TripMember>();
let membersHydrated = false;

function hydrateMembersFromLocal(): void {
  if (membersHydrated || typeof window === "undefined") return;
  membersHydrated = true;

  const saved = readLocalJson<TripMember[]>(MEMBERS_STORAGE_KEY);
  if (!Array.isArray(saved)) return;
  for (const member of saved) {
    if (member?.tripId && member?.userId) {
      memoryMembers.set(memberMemoryKey(member.tripId, member.userId), member);
    }
  }
}

function persistMembersToLocal(): void {
  if (typeof window === "undefined") return;
  writeLocalJson(MEMBERS_STORAGE_KEY, [...memoryMembers.values()]);
}

/** Clear persisted + in-memory members (e.g. on sign out). */
export function clearPersistedMembers(): void {
  memoryMembers.clear();
  membersHydrated = true;
  removeLocalJson(MEMBERS_STORAGE_KEY);
}

function memberPk(tripId: string, userId: string) {
  return `MEMBER#${tripId}#${userId}`;
}

function tripMembersGsiPk(tripId: string) {
  return `TRIP#${tripId}`;
}

async function loadDynamo() {
  const [{ docClient, TABLE_NAME }, commands] = await Promise.all([
    import("@/lib/dynamodb"),
    import("@aws-sdk/lib-dynamodb"),
  ]);
  return { docClient, TABLE_NAME, ...commands };
}

/** Organizer first, then by join time. */
export function sortTripMembers(members: TripMember[]): TripMember[] {
  return [...members].sort((a, b) => {
    if (a.role === "organizer" && b.role !== "organizer") return -1;
    if (b.role === "organizer" && a.role !== "organizer") return 1;
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });
}

function memoryFetchMembers(tripId: string): TripMember[] {
  hydrateMembersFromLocal();
  const members = [...memoryMembers.values()].filter((m) => m.tripId === tripId);
  return sortTripMembers(members);
}

function memoryGetMember(
  tripId: string,
  userId: string
): TripMember | null {
  hydrateMembersFromLocal();
  return memoryMembers.get(memberMemoryKey(tripId, userId)) ?? null;
}

function memoryInsertMember(member: TripMember): void {
  hydrateMembersFromLocal();
  memoryMembers.set(memberMemoryKey(member.tripId, member.userId), member);
  persistMembersToLocal();
}

async function fetchMembersDynamo(tripId: string): Promise<TripMember[]> {
  const { docClient, TABLE_NAME, QueryCommand } = await loadDynamo();
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": tripMembersGsiPk(tripId),
        ":sk": "MEMBER#",
      },
    })
  );

  const members = (result.Items ?? []).map((item) => ({
    userId: item.userId as string,
    tripId: item.tripId as string,
    displayName: (item.displayName as string) ?? "",
    avatarUrl: item.avatarUrl as string | undefined,
    role: item.role as TripMember["role"],
    joinedAt: item.joinedAt as string,
  }));

  return sortTripMembers(members);
}

async function getMemberDynamo(
  tripId: string,
  userId: string
): Promise<TripMember | null> {
  const { docClient, TABLE_NAME, GetCommand } = await loadDynamo();
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: memberPk(tripId, userId), SK: "META" },
    })
  );

  if (!result.Item) return null;
  return {
    userId: result.Item.userId as string,
    tripId: result.Item.tripId as string,
    displayName: (result.Item.displayName as string) ?? "",
    avatarUrl: result.Item.avatarUrl as string | undefined,
    role: result.Item.role as TripMember["role"],
    joinedAt: result.Item.joinedAt as string,
  };
}

async function insertMemberDynamo(member: TripMember): Promise<void> {
  const { docClient, TABLE_NAME, PutCommand } = await loadDynamo();
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: memberPk(member.tripId, member.userId),
        SK: "META",
        entityType: "MEMBER",
        GSI1PK: tripMembersGsiPk(member.tripId),
        GSI1SK: `MEMBER#${member.userId}`,
        GSI2PK: member.userId,
        GSI2SK: `TRIP#${member.tripId}`,
        tripId: member.tripId,
        userId: member.userId,
        role: member.role,
        displayName: member.displayName,
        avatarUrl: member.avatarUrl,
        joinedAt: member.joinedAt,
      },
      ConditionExpression: "attribute_not_exists(PK)",
    })
  );
}

/** All members for a trip — sorted organizer-first. */
export async function fetchMembersForTrip(
  tripId: string
): Promise<TripMember[]> {
  if (!isDynamoConfigured()) return memoryFetchMembers(tripId);
  try {
    return await fetchMembersDynamo(tripId);
  } catch {
    return memoryFetchMembers(tripId);
  }
}

/** Single MEMBER row lookup — used to skip duplicate joins. */
export async function getTripMember(
  tripId: string,
  userId: string
): Promise<TripMember | null> {
  if (!isDynamoConfigured()) return memoryGetMember(tripId, userId);
  try {
    return await getMemberDynamo(tripId, userId);
  } catch {
    return memoryGetMember(tripId, userId);
  }
}

/** Insert a member row. Caller must check for duplicates first. */
export async function insertTripMember(member: TripMember): Promise<void> {
  if (!isDynamoConfigured()) {
    memoryInsertMember(member);
    return;
  }
  try {
    await insertMemberDynamo(member);
  } catch {
    memoryInsertMember(member);
  }
}

/** Seed in-memory store for local / mock flows. */
export function seedMemoryMember(member: TripMember): void {
  memoryInsertMember(member);
}
