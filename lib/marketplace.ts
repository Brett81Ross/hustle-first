/**
 * Hustle First marketplace domain model and request validation.
 * Ownership is always derived from the authenticated Clerk user server-side.
 */
export const listingCategories = ["services", "goods", "rides", "jobs", "other"] as const;
export const listingStatuses = ["active", "paused", "closed"] as const;

export type ListingCategory = (typeof listingCategories)[number];
export type ListingStatus = (typeof listingStatuses)[number];

export type MarketplaceListing = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: ListingCategory;
  priceCents: number | null;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateListingInput = Pick<MarketplaceListing, "title" | "description" | "category" | "priceCents">;
export type UpdateListingInput = Partial<CreateListingInput> & { status?: ListingStatus };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, field: string, max: number) {
  if (typeof value !== "string") throw new Error(`${field} must be text.`);
  const cleaned = value.trim();
  if (!cleaned) throw new Error(`${field} is required.`);
  if (cleaned.length > max) throw new Error(`${field} is too long.`);
  return cleaned;
}

function cleanPrice(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > 100_000_000) {
    throw new Error("priceCents must be a nonnegative whole number.");
  }
  return value as number;
}

export function parseCreateListingInput(value: unknown): CreateListingInput {
  if (!isRecord(value)) throw new Error("Invalid listing.");
  if (!listingCategories.includes(value.category as ListingCategory)) throw new Error("Invalid category.");
  return {
    title: cleanText(value.title, "Title", 120),
    description: cleanText(value.description, "Description", 4000),
    category: value.category as ListingCategory,
    priceCents: cleanPrice(value.priceCents),
  };
}

export function parseUpdateListingInput(value: unknown): UpdateListingInput {
  if (!isRecord(value)) throw new Error("Invalid listing update.");
  const update: UpdateListingInput = {};
  if ("title" in value) update.title = cleanText(value.title, "Title", 120);
  if ("description" in value) update.description = cleanText(value.description, "Description", 4000);
  if ("category" in value) {
    if (!listingCategories.includes(value.category as ListingCategory)) throw new Error("Invalid category.");
    update.category = value.category as ListingCategory;
  }
  if ("priceCents" in value) update.priceCents = cleanPrice(value.priceCents);
  if ("status" in value) {
    if (!listingStatuses.includes(value.status as ListingStatus)) throw new Error("Invalid status.");
    update.status = value.status as ListingStatus;
  }
  if (Object.keys(update).length === 0) throw new Error("No supported fields to update.");
  return update;
}

export function ownsListing(listing: Pick<MarketplaceListing, "ownerId">, authenticatedUserId: string) {
  return listing.ownerId === authenticatedUserId;
}
