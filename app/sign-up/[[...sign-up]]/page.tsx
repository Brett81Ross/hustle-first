import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
 return <main className="shell auth-shell"><section className="card auth-card"><p className="eyebrow">Hustle First™</p><h1>Create your account</h1><p className="lede">Create your client-owned account with a username and password. Add an email only when you want to.</p><SignUp signInUrl="/sign-in" fallbackRedirectUrl="/client" /><p className="auth-help">Already have an account? <Link href="/sign-in">Sign in</Link>.</p></section><footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer></main>;
}