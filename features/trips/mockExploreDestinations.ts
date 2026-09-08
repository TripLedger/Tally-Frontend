/**
 * Placeholder explore destinations for the add-trip flow.
 * Images live in public/tabr/Trip cards/ until the backend supplies real places.
 */

export type ExploreCategory =
  | "All"
  | "Food"
  | "Drinks"
  | "Adventure"
  | "Beach"
  | "Culture";

export interface ExploreDestination {
  id: string;
  name: string;
  area: string;
  city: string;
  rating: number;
  reviewCount: number;
  /** Display string matching Figma, e.g. "~ N10,000/person" */
  priceLabel: string;
  category: Exclude<ExploreCategory, "All">;
  /** Path under /public — spaces preserved for the exported asset folder */
  imageSrc: string;
  /** Full-bleed detail hero — falls back to imageSrc when omitted */
  detailImageSrc?: string;
  description: string;
}

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  "All",
  "Food",
  "Drinks",
  "Adventure",
  "Beach",
  "Culture",
];

const CARD = (n: 1 | 2 | 3 | 4 | 5) =>
  `/tabr/Trip cards/Trip card ${n}.png`;

/** Figma location-details hero — public/tabr/Trip cards/trip location.png */
const DETAIL_HERO = "/tabr/Trip cards/trip location.png";

/** Figma “Let's prepare your trip” list — swap for API results later. */
export const MOCK_EXPLORE_DESTINATIONS: ExploreDestination[] = [
  {
    id: "cafe-alyanto",
    name: "Cafe Alyanto",
    area: "Lekki",
    city: "Lagos",
    rating: 4.5,
    reviewCount: 60,
    priceLabel: "~ N10,000/person",
    category: "Food",
    imageSrc: CARD(3),
    detailImageSrc: DETAIL_HERO,
    description:
      "Features a serene neighborhood, specializing in smooth cappuccinos, topped with velvety foam and a sprinkle of cocoa. Known for artisanal paninis. A good place to unwind or catch up with friends.",
  },
  {
    id: "la-tropicana",
    name: "La Tropicana",
    area: "Ilupeju",
    city: "Lagos",
    rating: 4.5,
    reviewCount: 60,
    priceLabel: "~ N12,000/person",
    category: "Drinks",
    imageSrc: CARD(4),
    description:
      "A bright lounge with bold accents and easygoing nights. Great cocktails, good music, and space for the whole crew to settle in.",
  },
  {
    id: "the-shandys",
    name: "The Shandy's",
    area: "Lekki",
    city: "Lagos",
    rating: 4.5,
    reviewCount: 60,
    priceLabel: "~ N12,000/person",
    category: "Culture",
    imageSrc: CARD(5),
    description:
      "A calm gallery-like space for lingering over drinks and conversation. Minimal interiors, rotating art, and a soft evening crowd.",
  },
  {
    id: "curry-pizza",
    name: "Curry Pizza",
    area: "Ibeju",
    city: "Lagos",
    rating: 4.5,
    reviewCount: 60,
    priceLabel: "~ N15,000/person",
    category: "Food",
    imageSrc: CARD(2),
    description:
      "Shared plates, warm lighting, and a table built for friends. Come hungry — the house pizzas and sides are made for the group.",
  },
  {
    id: "the-zibas-resort",
    name: "The Zibas Resort",
    area: "Ajah",
    city: "Lagos",
    rating: 4.5,
    reviewCount: 60,
    priceLabel: "~ N20,000/person",
    category: "Beach",
    imageSrc: CARD(1),
    description:
      "Infinity views, palm shade, and an easy day-to-night pace. Ideal for a crew reset by the water without leaving the city.",
  },
];

export function getExploreDestinationById(
  id: string
): ExploreDestination | undefined {
  return MOCK_EXPLORE_DESTINATIONS.find((place) => place.id === id);
}

export function getExploreDestinationDetailImage(
  destination: ExploreDestination
): string {
  return destination.detailImageSrc ?? destination.imageSrc;
}

export function filterExploreDestinations(
  destinations: ExploreDestination[],
  opts: { category: ExploreCategory; query: string; city?: string }
): ExploreDestination[] {
  const q = opts.query.trim().toLowerCase();
  return destinations.filter((place) => {
    if (opts.category !== "All" && place.category !== opts.category) {
      return false;
    }
    if (opts.city && place.city.toLowerCase() !== opts.city.toLowerCase()) {
      return false;
    }
    if (!q) return true;
    return (
      place.name.toLowerCase().includes(q) ||
      place.area.toLowerCase().includes(q) ||
      place.category.toLowerCase().includes(q)
    );
  });
}
