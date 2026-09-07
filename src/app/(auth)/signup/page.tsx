"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("Account created, but sign in failed. Try logging in.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="ef-card ef-rise">
      <h1 className="ef-page mb-1">Create your account</h1>
      <p className="ef-small text-neutral-600 mb-6">Start tracking your vibe coding projects.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="ef-small font-medium">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ef-input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="ef-small font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ef-input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="ef-small font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ef-input"
          />
          <span className="ef-caption">At least 8 characters.</span>
        </div>

        {error && <p className="ef-small text-[color:var(--danger)]">{error}</p>}

        <button type="submit" disabled={loading} className="ef-btn ef-btn-primary mt-2">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="ef-small text-neutral-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="ef-btn-text !p-0 underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
