import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = { title: { default:"Hustle First™", template:"%s · Hustle First™" }, description:"A client-owned marketplace for services, goods, rides, jobs, and more.", applicationName:"Hustle First™" };
export const viewport: Viewport = { width:"device-width", initialScale:1, viewportFit:"cover", themeColor:"#0b0d0e" };

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up"><html lang="en"><body>{children}</body></html></ClerkProvider>}