import { NextResponse } from "next/server";
import { deleteOwnedListing, findOwnedListing, updateOwnedListing } from "../../../../../lib/marketplace-repository";
import { parseUpdateListingInput } from "../../../../../lib/marketplace";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const listing = await findOwnedListing(id);
    return listing
      ? NextResponse.json({ listing })
      : NextResponse.json({ error: "Listing not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const input = parseUpdateListingInput(await request.json());
    const listing = await updateOwnedListing(id, input);
    return listing
      ? NextResponse.json({ listing })
      : NextResponse.json({ error: "Listing not found." }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const deleted = await deleteOwnedListing(id);
    return deleted
      ? new Response(null, { status: 204 })
      : NextResponse.json({ error: "Listing not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
