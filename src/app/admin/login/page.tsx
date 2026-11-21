"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Feather, Lock, User, ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid login credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Website</span>
        </Link>

        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-forest-800/40 bg-white mx-auto shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt="Feathered Haven Parrot Rescue Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-forest-900 uppercase tracking-wide">
          Feathered Haven Admin
        </h2>
        <p className="text-xs text-forest-700/80">
          Secure management suite for sanctuary caretakers and adoption officers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-cream-50 py-8 px-6 sm:px-10 rounded-3xl border border-cream-300 shadow-md space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-forest-600/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-100 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-cream-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest-600/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-100 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-cream-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-900 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-forest-300" />
              <span>{loading ? "Authenticating..." : "Sign In to Admin Panel"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
