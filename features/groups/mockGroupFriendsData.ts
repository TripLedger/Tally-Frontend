import type { Trip, TripMember } from "@/types";
import { FIGMA_HERO_AVATAR_CLUSTER } from "@/features/home/figmaUserAvatars";
import {
  getMockExistingHomeMembersByTrip,
  getMockExistingHomeTripCounts,
  getMockExistingHomeTrips,
  MOCK_EXISTING_HOME_TRIP,
} from "@/features/home/mockExistingHomeData";

export interface GroupMemberView {
  member: TripMember;
  email: string;
}

const PREVIEW_MEMBER_EMAILS: Record<string, string> = {
  "preview-aniekan": "aniekananiekan@quietly.com",
  "preview-mark": "markplus@loopai.com",
  "preview-daniel": "staff.engineer@loopai.com",
  "preview-ruth": "ruth.lee@google.com",
  "preview-alex": "alex@quietly.com",
  "preview-sam": "sam@quietly.com",
  "preview-jordan": "jordan@quietly.com",
  "preview-casey": "casey@quietly.com",
};

/** Figma trip count on group detail hero (may differ from home card). */
const PREVIEW_GROUP_DETAIL_TRIP_COUNTS: Record<string, number> = {
  "preview-trip-my-day-ones": 2,
};

/** Friends-list row photos — public/tabr/home/images/users/ */
export const MEMBER_AVATARS = {
  aniekan: "/tabr/home/images/users/Ellipse%2058.png",
  mark: "/tabr/home/images/users/Ellipse%2058%20(1).png",
  daniel: "/tabr/home/images/users/Ellipse%2058%20(2).png",
  ruth: "/tabr/home/images/users/Ellipse%2058%20(3).png",
} as const;

/** Figma-accurate members for preview group detail (My Day Ones). */
export const PREVIEW_GROUP_FRIENDS_MEMBERS: GroupMemberView[] = [
  {
    member: {
      userId: "preview-aniekan",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Aniekan Aniekan",
      avatarUrl: MEMBER_AVATARS.aniekan,
      role: "organizer",
      joinedAt: "2026-01-01T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-aniekan"],
  },
  {
    member: {
      userId: "preview-mark",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Mark Pius",
      avatarUrl: MEMBER_AVATARS.mark,
      role: "member",
      joinedAt: "2026-01-02T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-mark"],
  },
  {
    member: {
      userId: "preview-daniel",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Daniel Dressco",
      avatarUrl: MEMBER_AVATARS.daniel,
      role: "member",
      joinedAt: "2026-01-03T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-daniel"],
  },
  {
    member: {
      userId: "preview-ruth-a",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Ruth Lee",
      avatarUrl: MEMBER_AVATARS.ruth,
      role: "member",
      joinedAt: "2026-01-04T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-ruth"],
  },
  {
    member: {
      userId: "preview-ruth-b",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Ruth Lee",
      avatarUrl: MEMBER_AVATARS.ruth,
      role: "member",
      joinedAt: "2026-01-05T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-ruth"],
  },
  {
    member: {
      userId: "preview-alex",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Alex Morgan",
      avatarUrl: MEMBER_AVATARS.aniekan,
      role: "member",
      joinedAt: "2026-01-06T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-alex"],
  },
  {
    member: {
      userId: "preview-sam",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Sam Okoro",
      avatarUrl: MEMBER_AVATARS.mark,
      role: "member",
      joinedAt: "2026-01-07T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-sam"],
  },
  {
    member: {
      userId: "preview-jordan",
      tripId: MOCK_EXISTING_HOME_TRIP.id,
      displayName: "Jordan Kim",
      avatarUrl: MEMBER_AVATARS.daniel,
      role: "member",
      joinedAt: "2026-01-08T00:00:00.000Z",
    },
    email: PREVIEW_MEMBER_EMAILS["preview-jordan"],
  },
];

/** Hero avatar stack — public/tabr/home/avatars. */
export const HERO_AVATAR_CLUSTER = FIGMA_HERO_AVATAR_CLUSTER;

export const GROUP_HERO_COVER = "/tabr/home/images/friends2.png";

export function isPreviewGroupTripId(tripId: string): boolean {
  return tripId.startsWith("preview-");
}

export function getPreviewGroupTrip(tripId: string): Trip | null {
  return getMockExistingHomeTrips().find((trip) => trip.id === tripId) ?? null;
}

export function getPreviewGroupFriendsMembers(
  tripId: string
): GroupMemberView[] {
  if (tripId === MOCK_EXISTING_HOME_TRIP.id) {
    return PREVIEW_GROUP_FRIENDS_MEMBERS;
  }

  const members = getMockExistingHomeMembersByTrip()[tripId] ?? [];
  return members.map((member) => ({
    member,
    email: emailFromDisplayName(member.displayName),
  }));
}

export function getPreviewGroupTripCount(tripId: string): number {
  if (tripId in PREVIEW_GROUP_DETAIL_TRIP_COUNTS) {
    return PREVIEW_GROUP_DETAIL_TRIP_COUNTS[tripId];
  }
  return getMockExistingHomeTripCounts()[tripId] ?? 1;
}

export function membersToGroupViews(members: TripMember[]): GroupMemberView[] {
  return members.map((member) => ({
    member,
    email: emailFromDisplayName(member.displayName),
  }));
}

function emailFromDisplayName(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${slug || "member"}@quietly.com`;
}
