"use client";

import Link from "next/link";
import { useEffect } from "react";

type RuntimeError = Error & { digest?: string };

export default function ErrorPage({
  error,
  reset,
}: {
  error: RuntimeError;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Hustle First runtime error]", {
      name: error.name,
      message: error.message,
      digest: error.digest ?? null,
      stack: error.stack ?? null,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
    });
  }, [error]);

  const diagnosticId = error.digest ?? "client-runtime";

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Hustle First™</p>
        <h1>Something went wrong</h1>
        <p className="lede">
          Your account and listings have not been changed. Try the page again,
          or return to the marketplace.
        </p>
        <p className="diagnostic-id" aria-label="Diagnostic ID">
          Diagnostic ID: <code>{diagnosticId}</code>
        </p>
        <div className="actions">
          <button className="button" onClick={() => reset()}>
            Try again
          </button>
          <Link className="button secondary" href="/marketplace">
            Marketplace
          </Link>
          <Link className="button secondary" href="/">
            Home
          </Link>
        </div>
      </section>
      <footer>
        Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.
      </footer>
    </main>
  );
}
