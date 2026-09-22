# Hustle First™
A mobile-first, client-owned marketplace for services, goods, rides, job opportunities, and other community offers.

## Stack
- Next.js App Router + TypeScript
- Clerk authentication
- Prisma ORM
- Neon PostgreSQL

## Security model
- /client and /api/client routes require authentication.
- Listing ownership is derived from the authenticated Clerk user on the server.
- Browser-supplied owner IDs are never trusted.
- Public marketplace reads expose only deliberately public listing fields.
- Private API responses use no-store caching controls.
- Baseline browser security headers are configured in next.config.ts.

## Quality gate
GitHub Actions validates the Prisma schema, verifies database connectivity, and runs the production Next.js build before merge. Feature branches are merged only after a green ABL QA run.

## Current release boundary
v0.18.0 is a pre-deployment readiness checkpoint. No production deployment is implied by this repository state.

### Known launch gates
1. Verify Clerk runtime signup/sign-in behavior, including intended username/password access without mandatory email.
2. Reconcile Clerk access mode with intended self-service signup.
3. Complete the secure listing-interest/contact workflow after the Neon migration connector is available.
4. Add request rate limiting before broad public launch.
5. Perform live mobile/runtime verification after the deployment quota resets.

No service worker is used.
