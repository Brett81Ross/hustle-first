/**
 * Hustle First marketplace domain model.
 *
 * Ownership is always keyed to the authenticated Clerk user ID. Never accept
 * ownerId from a browser form or request body; derive it from auth() server-side.
 */

export const listingCategories = [
  "services",
  "goods",
  "rides",
  "jobs",
  "other",
] as const;

export type ListingCategory = (typeof listingCategories)[number];

export type MarketplaceListing = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: ListingCategory;
  priceCents: number | null;
  status: "active" | "paused" | "closed";
  createdAt: string;
  updatedAt: string;
};

export type CreateListingInput = Pick<
  MarketplaceListing,
  "title" | "description" | "category" | "priceCents"
>;

export function ownsListing(
  listing: Pick<MarketplaceListing, "ownerId">,
  authenticatedUserId: string,
) {
  return listing.ownerId === authenticatedUserId;
}
