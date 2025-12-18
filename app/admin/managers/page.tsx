"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Manager = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function ManagersListPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchManagers = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("/api/managers");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load managers");
        }
        setManagers(data.managers || []);
      } catch (err: any) {
        setError(err.message || "Failed to load managers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagers();
  }, []);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="w-full max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-semibold text-slate-50">
          Admin access required
        </h1>
        <p className="text-sm text-slate-300/80">
          You must be signed in as an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          All Managers
        </h1>
        <p className="text-sm text-slate-300/80">
          Complete list of all managers in the system with their details.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-sky-500/15 to-violet-500/20 opacity-50 blur-2xl" />
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-slate-400">
              Loading managers...
            </p>
          ) : error ? (
            <p className="py-6 text-center text-sm text-red-400">{error}</p>
          ) : managers.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No managers found in the system.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-200/90">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Created</th>
                    <th className="px-3 py-2 font-medium">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {managers.map((manager) => (
                    <tr key={manager.id} className="align-middle hover:bg-slate-900/40 transition">
                      <td className="px-3 py-3">
                        <div className="text-xs font-medium text-slate-50">
                          {manager.name}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-xs text-slate-100">
                          {manager.email}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                          {manager.role}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[11px] text-slate-300">
                        {new Date(manager.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-[11px] text-slate-300">
                        {new Date(manager.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start">
        <Link
          href="/admin"
          className="text-xs font-medium text-slate-400 hover:text-slate-50 transition"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}

