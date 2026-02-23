"use client";
import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSent(true);
    } else {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-lg font-semibold text-green-700">NestEgg</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">💻</div>
              <h1 className="text-2xl font-bold text-gray-900">Check the server console</h1>
              <p className="text-gray-500">Your sign-in link was printed to the terminal running <code className="bg-gray-100 px-1 rounded">npm run dev</code>.</p>
              <p className="text-sm text-gray-400">
                Wrong email?{" "}
                <button onClick={() => setSent(false)} className="text-green-600 underline">Go back</button>
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Save your progress</h1>
              <p className="text-gray-500 mb-6">Enter your email and we&apos;ll print a sign-in link to the server console.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {loading ? "Sending..." : "Send sign-in link →"}
                </button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-4">
                <Link href="/setup/done" className="text-green-600 hover:underline">Skip for now</Link>
              </p>
            </>
          )}
        </div>
      </main>
      <footer className="px-4 py-6 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400 text-center">
          NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice.
        </p>
      </footer>
    </div>
  );
}
