"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isHomePage = pathname === "/";

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-50 transition hover:text-sky-400"
        >
          <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Customer Support Hub
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`text-xs font-medium transition ${
                    pathname === "/admin"
                      ? "text-sky-400"
                      : "text-slate-300 hover:text-slate-50"
                  }`}
                >
                  Admin
                </Link>
              )}
              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <Link
                  href={user.role === "ADMIN" ? "/admin/managers" : "/manager"}
                  className={`text-xs font-medium transition ${
                    pathname === "/manager" || pathname === "/admin/managers"
                      ? "text-sky-400"
                      : "text-slate-300 hover:text-slate-50"
                  }`}
                >
                  Manager
                </Link>
              )}
              <Link
                href={user.role === "ADMIN" ? "/admin/employees" : "/employee"}
                className={`text-xs font-medium transition ${
                  pathname === "/employee" || pathname === "/admin/employees"
                    ? "text-sky-400"
                    : "text-slate-300 hover:text-slate-50"
                }`}
              >
                Employee
              </Link>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{user.name}</span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            !isAuthPage && (
              <>
                <Link
                  href="/login"
                  className={`text-xs font-medium transition ${
                    pathname === "/login"
                      ? "text-sky-400"
                      : "text-slate-300 hover:text-slate-50"
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20"
                >
                  Sign up
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}

