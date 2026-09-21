import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="shell">
      <section className="card auth-card">
        <p className="eyebrow">Hustle First™</p>
        <h1>Welcome back</h1>
        <p>Sign in to your client account.</p>
        <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/" />
      </section>
    </main>
  );
}
