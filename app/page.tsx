import Link from "next/link";
import AppFooter from "../components/AppFooter";
import ShareHustleFirst from "../components/ShareHustleFirst";

export default function Home() {
  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Cactus🌵Byte Studios™</p>
        <h1>Hustle First™</h1>
        <p className="lede">A marketplace built around what people can offer, make, sell, and do.</p>
        <div className="actions">
          <Link className="button" href="/marketplace">Browse marketplace</Link>
          <Link className="button secondary" href="/client">My hustle</Link>
          <Link className="button secondary" href="/sign-in">Sign in</Link>
          <Link className="button secondary" href="/sign-up">Create account</Link>
          <ShareHustleFirst />
        </div>
      </section>
      <AppFooter />
    </main>
  );
}
