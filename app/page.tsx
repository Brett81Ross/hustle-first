import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Cactus🌵Byte Studios™</p>
        <h1>Hustle First™</h1>
        <p>Marketplace for clients</p>
        <SignedOut>
          <div className="actions">
            <Link className="button" href="/sign-in">Sign in</Link>
            <Link className="button secondary" href="/sign-up">Create account</Link>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="actions">
            <Link className="button" href="/client">Open client area</Link>
            <UserButton />
          </div>
        </SignedIn>
      </section>
      <footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer>
    </main>
  );
}
