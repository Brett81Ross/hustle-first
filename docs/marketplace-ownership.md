# Marketplace ownership boundary

Hustle First™ client data belongs to the individual authenticated account, not
to a facility.

## Server authority

For every listing create, read-private, update, or delete operation:

1. Resolve the current Clerk user with server-side `auth()`.
2. Derive `ownerId` from the authenticated `userId`.
3. Never trust an `ownerId`, user ID, role, or ownership claim supplied by the
   browser.
4. For update/delete/private-owner reads, load the record and verify
   `record.ownerId === userId` before returning or mutating it.
5. Public marketplace reads may expose only fields deliberately designated
   public. Private account/profile fields remain server-protected.

These rules are application invariants. A later persistence ABL must enforce
the same boundary at the database/query layer rather than relying on UI state.
