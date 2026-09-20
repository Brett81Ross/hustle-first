import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hustle First™",
  description: "Marketplace for clients",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
