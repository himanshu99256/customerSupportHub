"use client";

import { useEffect, useState } from "react";

type Assignment = {
  id: number;
  assetId: number;
  userId: number;
  assignedById: number;
  assignedAt: string;
  returnedAt: string | null;
  status: "ACTIVE" | "RETURNED";
  assetName: string;
  assetType: string;
  serialNumber: string | null;
  assetStatus: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "RETIRED";
  employeeName: string;
  employeeEmail: string;
  managerName: string;
  managerEmail: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
    const fetchAssignments = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("/api/asset-assignments");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load activity");
        }
        setAssignments(data.assignments || []);
      } catch (err: any) {
        setError(err.message || "Failed to load activity");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="w-full max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-semibold text-slate-50">
          Admin access required
        </h1>
        <p className="text-sm text-slate-300/80">
          You must be signed in as an admin to view the global activity
          dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Admin · Activity overview
        </h1>
        <p className="text-sm text-slate-300/80">
          See asset assignments and returns across all members in one place.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-fuchsia-500/20 via-sky-500/15 to-emerald-500/20 opacity-50 blur-2xl" />
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Member activity
              </h2>
              <p className="text-xs text-slate-400">
                Latest asset assignments and returns for all users.
              </p>
            </div>
          </div>

          {isLoading ? (
            <p className="py-6 text-center text-sm text-slate-400">
              Loading activity...
            </p>
          ) : error ? (
            <p className="py-6 text-center text-sm text-red-400">{error}</p>
          ) : assignments.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No activity yet. Once assets are assigned and returned,
              you&apos;ll see them here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-200/90">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-3 py-2 font-medium">Asset</th>
                    <th className="px-3 py-2 font-medium">Employee</th>
                    <th className="px-3 py-2 font-medium">Assigned by</th>
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
                      <td className="px-3 py-2">
                        <div className="text-xs text-slate-100">
                          {a.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {a.employeeEmail}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs text-slate-100">
                          {a.managerName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {a.managerEmail}
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


