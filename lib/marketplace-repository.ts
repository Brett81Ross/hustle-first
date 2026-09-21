import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function listOwnedListings() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.marketplaceListing.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findOwnedListing(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.marketplaceListing.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });
}
