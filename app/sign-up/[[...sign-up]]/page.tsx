import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="shell">
      <section className="card auth-card">
        <p className="eyebrow">Hustle First™</p>
        <h1>Create your account</h1>
        <p>Your account belongs to you and is not tied to a facility.</p>
        <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/" />
      </section>
    </main>
  );
}
