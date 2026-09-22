import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import type { CreateListingInput, UpdateListingInput } from "./marketplace";

async function requireUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function listOwnedListings() {
  const userId = await requireUserId();

  return db.marketplaceListing.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findOwnedListing(id: string) {
  const userId = await requireUserId();

  return db.marketplaceListing.findFirst({
    where: { id, ownerId: userId },
  });
}

export async function createOwnedListing(input: CreateListingInput) {
  const userId = await requireUserId();

  return db.marketplaceListing.create({
    data: {
      ownerId: userId,
      title: input.title,
      description: input.description,
      category: input.category,
      priceCents: input.priceCents,
    },
  });
}

export async function updateOwnedListing(
  id: string,
  input: UpdateListingInput,
) {
  const userId = await requireUserId();

  const existing = await db.marketplaceListing.findFirst({
    where: { id, ownerId: userId },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  return db.marketplaceListing.update({
    where: { id: existing.id },
    data: input,
  });
}

export async function deleteOwnedListing(id: string) {
  const userId = await requireUserId();

  const result = await db.marketplaceListing.deleteMany({
    where: { id, ownerId: userId },
  });

  return result.count === 1;
}
