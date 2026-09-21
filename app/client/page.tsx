import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function ClientPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Hustle First™</p>
        <h1>Client area</h1>
        <p>You are signed in to your private Hustle First account.</p>
        <p className="status">
          Account: {user?.username ?? user?.primaryEmailAddress?.emailAddress ?? userId}
        </p>
        <Link className="button" href="/">Back home</Link>
      </section>
      <footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer>
    </main>
  );
}
