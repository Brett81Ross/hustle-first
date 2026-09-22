import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { listOwnedListings } from "../../lib/marketplace-repository";

function money(cents: number | null) {
  return cents === null ? "Contact for price" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function ClientPage() {
  const user = await currentUser();
  const listings = await listOwnedListings();

  return (
    <main className="shell marketplace-shell">
      <header className="market-header">
        <div>
          <p className="eyebrow">Hustle First™ Marketplace</p>
          <h1>My hustle</h1>
          <p className="lede">Post what you can do, sell, offer, or help with. Your listings stay attached to your account.</p>
        </div>
        <div className="account-chip">{user?.username ?? user?.primaryEmailAddress?.emailAddress ?? "Signed in"}</div>
      </header>

      <section className="market-actions" aria-label="Marketplace actions">
        <Link className="button" href="/client/listings/new">+ New listing</Link>
        <Link className="button secondary" href="/">Home</Link>
      </section>

      <section className="listing-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your listings</p>
            <h2>{listings.length === 0 ? "Ready when you are" : `${listings.length} ${listings.length === 1 ? "listing" : "listings"}`}</h2>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="empty-state">
            <h3>Start with your first hustle.</h3>
            <p>Create a listing for a service, item, ride, job opportunity, or something else you can offer.</p>
            <Link className="button" href="/client/listings/new">Create first listing</Link>
          </div>
        ) : (
          <div className="listing-grid">
            {listings.map((listing) => (
              <article className="listing-card" key={listing.id}>
                <div className="listing-meta"><span>{listing.category}</span><span>{listing.status}</span></div>
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <strong>{money(listing.priceCents)}</strong>
                <Link className="text-link" href={`/client/listings/${listing.id}`}>Manage listing →</Link>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer>
    </main>
  );
}
