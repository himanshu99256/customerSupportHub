"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to dashboard or home page
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/20 via-sky-400/15 to-emerald-400/25 opacity-80 blur-2xl" />
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Create your workspace
            </h1>
            <p className="text-sm text-slate-300/80">
              Set up an account to start tracking employees, devices and
              licenses.
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
                  htmlFor="name"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/60"
                  placeholder="Himanshu Ranpariya"
                />
              </div>

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
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/60"
                  placeholder="himanshu@gmail.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/60"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/60"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label
                  htmlFor="role"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/60"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  Choose how you will use the system. This controls your access
                  level once authorization is implemented.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-violet-500 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-violet-500/30 transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300/80">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                Log in
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


