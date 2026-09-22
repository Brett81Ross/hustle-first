import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
 return <main className="shell auth-shell"><section className="card auth-card"><p className="eyebrow">Hustle First™</p><h1>Welcome back</h1><p className="lede">Sign in with the username or email connected to your account.</p><SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/client" /><p className="auth-help">New here? <Link href="/sign-up">Create your account</Link>. Your account belongs to you—not a facility.</p></section><footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer></main>;
}