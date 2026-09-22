import Link from "next/link";
import { listingCategories, type ListingCategory } from "../../lib/marketplace";
import { listActiveMarketplaceListings } from "../../lib/marketplace-repository";

function money(cents:number|null){return cents===null?"Contact for price":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(cents/100)}
export default async function MarketplacePage({searchParams}:{searchParams:Promise<{category?:string}>}){
 const params=await searchParams;
 const category=listingCategories.includes(params.category as ListingCategory)?params.category:undefined;
 const listings=await listActiveMarketplaceListings(category);
 return <main className="shell marketplace-shell">
  <header className="market-header"><div><p className="eyebrow">Hustle First™</p><h1>Marketplace</h1><p className="lede">Discover what people in the Hustle First community are offering.</p></div><Link className="button" href="/client">My hustle</Link></header>
  <nav className="filter-row" aria-label="Listing categories"><Link className={!category?"filter active":"filter"} href="/marketplace">All</Link>{listingCategories.map(c=><Link key={c} className={category===c?"filter active":"filter"} href={`/marketplace?category=${c}`}>{c}</Link>)}</nav>
  {listings.length===0?<section className="empty-state"><h2>No active listings yet.</h2><p>When community members publish active listings, they will appear here.</p></section>:<section className="listing-grid">{listings.map(l=><article className="listing-card" key={l.id}><div className="listing-meta"><span>{l.category}</span><span>Active</span></div><h3>{l.title}</h3><p>{l.description}</p><strong>{money(l.priceCents)}</strong></article>)}</section>}
  <footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer>
 </main>
}
