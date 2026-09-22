import { NextResponse } from "next/server";
import { createOwnedListing, listOwnedListings } from "../../../../lib/marketplace-repository";
import { parseCreateListingInput } from "../../../../lib/marketplace";

export async function GET() {
  try {
    return NextResponse.json({ listings: await listOwnedListings() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const input = parseCreateListingInput(await request.json());
    const listing = await createOwnedListing(input);
    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
