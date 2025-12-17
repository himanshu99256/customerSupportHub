"use client";

import { useEffect, useState } from "react";

type Assignment = {
  id: number;
  assetId: number;
  userId: number;
  assignedAt: string;
  returnedAt: string | null;
  status: "ACTIVE" | "RETURNED";
  assetName: string;
  assetType: string;
  serialNumber: string | null;
  assetStatus: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "RETIRED";
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function EmployeeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Pull user info from localStorage (set during login/signup)
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (_err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/my-assignments?userId=${user.id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load assignments");
        }
        setAssignments(data.assignments || []);
      } catch (err: any) {
        setError(err.message || "Failed to load assignments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-semibold text-slate-50">
          Sign in to view your assets
        </h1>
        <p className="text-sm text-slate-300/80">
          We couldn&apos;t find your session. Please log in again to view your
          assigned assets.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Hello, {user.name}
          </h1>
          <p className="text-sm text-slate-300/80">
            Here are the assets assigned to you. Return or maintenance status is
            managed by your manager.
          </p>
        </div>
        <div className="rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-200 shadow-sm">
          {user.email} · {user.role}
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/15 via-indigo-500/15 to-emerald-400/15 opacity-50 blur-2xl" />
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Your assigned assets
              </h2>
              <p className="text-xs text-slate-400">
                Issued items and their current lifecycle status.
              </p>
            </div>
          </div>

          {isLoading ? (
            <p className="py-6 text-center text-sm text-slate-400">
              Loading your assignments...
            </p>
          ) : error ? (
            <p className="py-6 text-center text-sm text-red-400">{error}</p>
          ) : assignments.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              You don&apos;t have any assigned assets yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-200/90">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-3 py-2 font-medium">Asset</th>
                    <th className="px-3 py-2 font-medium">Issued</th>
                    <th className="px-3 py-2 font-medium">Returned</th>
                    <th className="px-3 py-2 font-medium">Asset status</th>
                    <th className="px-3 py-2 font-medium">Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {assignments.map((a) => (
                    <tr key={a.id} className="align-middle">
                      <td className="px-3 py-2">
                        <div className="text-xs font-medium text-slate-50">
                          {a.assetName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {a.assetType}
                          {a.serialNumber ? ` · ${a.serialNumber}` : ""}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-slate-300">
                        {new Date(a.assignedAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-[11px] text-slate-400">
                        {a.returnedAt
                          ? new Date(a.returnedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            a.assetStatus === "ASSIGNED"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                            : a.assetStatus === "MAINTENANCE"
                              ? "bg-amber-500/10 text-amber-200 border border-amber-500/40"
                              : a.assetStatus === "RETIRED"
                                ? "bg-slate-500/10 text-slate-300 border border-slate-500/40"
                                : "bg-sky-500/10 text-sky-200 border border-sky-500/40"
                          }`}
                        >
                          {a.assetStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            a.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                              : "bg-slate-500/10 text-slate-300 border border-slate-500/40"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


