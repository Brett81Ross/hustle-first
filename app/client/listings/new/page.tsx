"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewListingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError("");
    const data = new FormData(event.currentTarget);
    const dollars = String(data.get("price") ?? "").trim();
    const response = await fetch("/api/client/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        description: data.get("description"),
        category: data.get("category"),
        priceCents: dollars === "" ? null : Math.round(Number(dollars) * 100),
      }),
    });
    const body = await response.json();
    if (!response.ok) { setError(body.error ?? "Could not create listing."); setSaving(false); return; }
    router.push("/client"); router.refresh();
  }

  return (
    <main className="shell marketplace-shell">
      <section className="form-card">
        <p className="eyebrow">Hustle First™ Marketplace</p>
        <h1>New listing</h1>
        <p className="lede">Tell people clearly what you are offering. You can manage the listing after it is created.</p>
        <form className="listing-form" onSubmit={submit}>
          <label>Title<input name="title" required maxLength={120} placeholder="What are you offering?" /></label>
          <label>Category<select name="category" defaultValue="services"><option value="services">Service</option><option value="goods">Goods</option><option value="rides">Ride</option><option value="jobs">Job opportunity</option><option value="other">Other</option></select></label>
          <label>Description<textarea name="description" required maxLength={4000} rows={7} placeholder="Describe the offer, important details, and what someone should know." /></label>
          <label>Price in dollars <span className="optional">(optional)</span><input name="price" type="number" min="0" max="1000000" step="0.01" inputMode="decimal" placeholder="25.00" /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions"><button className="button" disabled={saving} type="submit">{saving ? "Creating…" : "Create listing"}</button><Link className="button secondary" href="/client">Cancel</Link></div>
        </form>
      </section>
      <footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer>
    </main>
  );
}
