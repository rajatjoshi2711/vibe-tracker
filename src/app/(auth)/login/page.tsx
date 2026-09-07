"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Wrong email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="ef-card ef-rise">
      <h1 className="ef-page mb-1">Welcome back</h1>
      <p className="ef-small text-neutral-600 mb-6">Sign in to your vibe tracker.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ef-input"
          />
        </div>

        {error && <p className="ef-small text-[color:var(--danger)]">{error}</p>}

        <button type="submit" disabled={loading} className="ef-btn ef-btn-primary mt-2">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="ef-small text-neutral-600 mt-6">
        No account yet?{" "}
        <Link href="/signup" className="ef-btn-text !p-0 underline-offset-2">
          Create one
        </Link>
      </p>
    </div>
  );
}
