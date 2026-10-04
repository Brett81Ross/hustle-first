"use client";

import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function errorMessages(error: unknown): string[] {
  if (isClerkAPIResponseError(error)) {
    return error.errors.map((item) => item.longMessage || item.message);
  }
  return ["We couldn't create your account. Check your information and try again."];
}

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitErrors([]);

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setSubmitErrors(["Enter a username and password."]);
      return;
    }

    try {
      const { error } = await signUp.create({
        username: cleanUsername,
        password,
      });

      if (error) {
        setSubmitErrors(errorMessages(error));
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            const destination = decorateUrl("/client");
            if (destination.startsWith("http")) {
              window.location.href = destination;
            } else {
              router.push(destination);
            }
          },
        });
        return;
      }

      setSubmitErrors([
        "Clerk needs another account step before sign-up can finish. No account changes were forced.",
      ]);
    } catch (error) {
      setSubmitErrors(errorMessages(error));
    }
  }

  const isFetching = fetchStatus === "fetching";
  const fieldErrors = [
    errors.fields.username?.longMessage || errors.fields.username?.message,
    errors.fields.password?.longMessage || errors.fields.password?.message,
  ].filter((message): message is string => Boolean(message));
  const messages = [...fieldErrors, ...submitErrors];

  return (
    <main className="shell auth-shell">
      <section className="card auth-card">
        <p className="eyebrow">Hustle First™</p>
        <h1>Create your account</h1>
        <p className="lede">
          Your account belongs to you—not a facility. Start with a username and password.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              autoCapitalize="none"
              autoComplete="username"
              minLength={4}
              maxLength={64}
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              required
              spellCheck={false}
              value={username}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="new-password"
              minLength={15}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <p className="auth-note">
            Email is not required to create your account. Without an email or phone number on the
            account, password recovery by email or text will not be available.
          </p>

          {messages.length > 0 && (
            <div className="form-error" role="alert">
              {messages.map((message, index) => (
                <p key={`${message}-${index}`}>{message}</p>
              ))}
            </div>
          )}

          <div id="clerk-captcha" />

          <button className="button" disabled={isFetching} type="submit">
            {isFetching ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-help">
          Already have an account? <Link href="/sign-in">Sign in</Link>.
        </p>
      </section>
      <footer>Hustle First™ · Cactus🌵Byte Studios™ · All Rights Reserved.</footer>
    </main>
  );
}
