import Link from "next/link";

export default function AppFooter() {
  return (
    <footer>
      Hustle First™ ·{" "}
      <Link className="footer-link" href="https://cactusbyte-studios.vercel.app">
        Cactus🌵Byte Studios™
      </Link>{" "}
      · All Rights Reserved.
    </footer>
  );
}
