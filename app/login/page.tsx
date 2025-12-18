"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Store token and user in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect based on user role
      const role = data.user?.role;
      if (role === "EMPLOYEE") {
        window.location.href = "/employee";
      } else if (role === "MANAGER") {
        window.location.href = "/manager";
      } else if (role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/20 via-emerald-400/10 to-indigo-500/25 opacity-75 blur-2xl" />
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Welcome back
            </h1>
            <p className="text-sm text-slate-300/80">
              Sign in to manage employees, assets and assignments.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-2 text-left">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/70"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-slate-300"
                >
                  Remember me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-sky-400 hover:text-sky-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300/80">
            <p>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <Link
              href="/"
              className="block text-center hover:text-slate-200"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

