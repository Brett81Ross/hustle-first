"use client";

import { useState } from "react";

const APP_URL = "https://hustle-first.vercel.app";

export default function ShareHustleFirst() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hustle First™",
          text: "Check out Hustle First™ marketplace.",
          url: APP_URL,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setOpen(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button className="button secondary" type="button" onClick={share}>
        Share Hustle First
      </button>
      <button className="qr-button" type="button" onClick={() => setOpen(true)}>
        Show QR code
      </button>
      {open && (
        <div className="share-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            aria-labelledby="share-title"
            aria-modal="true"
            className="share-dialog"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button aria-label="Close share dialog" className="share-close" type="button" onClick={() => setOpen(false)}>
              ×
            </button>
            <p className="eyebrow">Share Hustle First™</p>
            <h2 id="share-title">Scan to open the marketplace</h2>
            <div className="qr-frame">
              <img alt="QR code for Hustle First" height="296" src="/hustle-first-qr.svg" width="296" />
            </div>
            <p className="share-url">{APP_URL}</p>
            <button className="button" type="button" onClick={copyLink}>
              {copied ? "Link copied" : "Copy link"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
