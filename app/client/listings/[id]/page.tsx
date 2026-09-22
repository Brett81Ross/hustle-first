"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Listing = { title:string; description:string; category:string; priceCents:number|null; status:string };

export default function ManageListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing,setListing]=useState<Listing|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ fetch(`/api/client/listings/${id}`).then(async r=>{const b=await r.json(); if(!r.ok) throw new Error(b.error); setListing(b.listing)}).catch(e=>setError(e.message||"Could not load listing.")); },[id]);

  async function save(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setBusy(true); setError("");
    const data=new FormData(event.currentTarget); const dollars=String(data.get("price")??"").trim();
    const r=await fetch(`/api/client/listings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:data.get("title"),description:data.get("description"),category:data.get("category"),status:data.get("status"),priceCents:dollars===""?null:Math.round(Number(dollars)*100)})});
    const b=await r.json(); if(!r.ok){setError(b.error??"Could not save listing.");setBusy(false);return;} router.push("/client");router.refresh();
  }

  async function remove(){ if(!confirm("Delete this listing? This cannot be undone.")) return; setBusy(true); const r=await fetch(`/api/client/listings/${id}`,{method:"DELETE"}); if(!r.ok){setError("Could not delete listing.");setBusy(false);return;} router.push("/client");router.refresh(); }

  if(error&&!listing) return <main className="shell"><section className="form-card"><h1>Listing unavailable</h1><p className="form-error">{error}</p><Link className="button" href="/client">Back to marketplace</Link></section></main>;
  if(!listing) return <main className="shell"><section className="form-card"><p>Loading listing…</p></section></main>;

  return <main className="shell marketplace-shell"><section className="form-card"><p className="eyebrow">Hustle First™ Marketplace</p><h1>Manage listing</h1>
    <form className="listing-form" onSubmit={save}>
      <label>Title<input name="title" required maxLength={120} defaultValue={listing.title}/></label>
      <label>Category<select name="category" defaultValue={listing.category}><option value="services">Service</option><option value="goods">Goods</option><option value="rides">Ride</option><option value="jobs">Job opportunity</option><option value="other">Other</option></select></label>
      <label>Description<textarea name="description" required maxLength={4000} rows={7} defaultValue={listing.description}/></label>
      <label>Price in dollars <span className="optional">(optional)</span><input name="price" type="number" min="0" max="1000000" step="0.01" inputMode="decimal" defaultValue={listing.priceCents===null?"":(listing.priceCents/100).toFixed(2)}/></label>
      <label>Status<select name="status" defaultValue={listing.status}><option value="active">Active</option><option value="paused">Paused</option><option value="closed">Closed</option></select></label>
      {error&&<p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><button className="button" disabled={busy} type="submit">{busy?"Saving…":"Save changes"}</button><Link className="button secondary" href="/client">Cancel</Link><button className="danger-button" disabled={busy} type="button" onClick={remove}>Delete listing</button></div>
    </form></section><footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer></main>;
}
