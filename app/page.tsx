import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Cactus🌵Byte Studios™</p>
        <h1>Hustle First™</h1>
        <p>Marketplace for clients</p>
        {userId ? (
          <div className="actions">
            <Link className="button" href="/client">Open client area</Link>
            <UserButton />
          </div>
        ) : (
          <div className="actions">
            <Link className="button" href="/sign-in">Sign in</Link>
            <Link className="button secondary" href="/sign-up">Create account</Link>
          </div>
        )}
      </section>
      <footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer>
    </main>
  );
}
