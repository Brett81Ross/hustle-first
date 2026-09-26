export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    {
      clerkEnvironment: {
        hasPublishableKey: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
        hasSecretKey: Boolean(process.env.CLERK_SECRET_KEY),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
