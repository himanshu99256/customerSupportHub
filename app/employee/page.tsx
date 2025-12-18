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
  managerDescription: string | null;
  employeeDescription: string | null;
  managerName: string | null;
  managerEmail: string | null;
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
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(
    null
  );
  const [editStatus, setEditStatus] = useState("COMPLETED");
  const [editDescription, setEditDescription] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

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

  const loadAssignments = async (currentUser: User | null) => {
    if (!currentUser) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/my-assignments?userId=${currentUser.id}`);
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

  useEffect(() => {
    loadAssignments(user);
  }, [user]);

  const openEditModal = (assignment: Assignment) => {
    setEditError("");
    setEditAssignment(assignment);

    // Try to pre-fill from existing employeeDescription if it follows our format
    if (assignment.employeeDescription) {
      const match = assignment.employeeDescription.match(
        /^Status:\s*(.*)\n([\s\S]*)$/
      );
      if (match) {
        setEditStatus(match[1] || "COMPLETED");
        setEditDescription(match[2] || "");
      } else {
        setEditStatus("COMPLETED");
        setEditDescription(assignment.employeeDescription);
      }
    } else {
      setEditStatus("COMPLETED");
      setEditDescription("");
    }
  };

  const saveEdit = async () => {
    if (!editAssignment) return;
    setEditSaving(true);
    setEditError("");
    try {
      const res = await fetch("/api/my-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: editAssignment.assetId,
          status: editStatus,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update notes");
      }

      await loadAssignments(user);
      setEditAssignment(null);
    } catch (err: any) {
      setEditError(err.message || "Failed to update notes");
    } finally {
      setEditSaving(false);
    }
  };

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
    <div className="w-full px-4 md:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Hello, {user.name}
        </h1>
        <p className="text-sm text-slate-300/80">
          Here are the assets assigned to you. Return or maintenance status is
          managed by your manager.
        </p>
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
                    <th className="px-3 py-2 font-medium">Manager</th>
                    <th className="px-3 py-2 font-medium">Issued</th>
                    <th className="px-3 py-2 font-medium">Assignment</th>
                    <th className="px-3 py-2 font-medium text-right">View</th>
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
                        {a.managerName ? (
                          <>
                            <div className="text-xs text-slate-100">
                              {a.managerName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {a.managerEmail}
                            </div>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-[11px] text-slate-300">
                        {new Date(a.assignedAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(a)}
                          className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/20"
                        >
                          {a.status}
                        </button>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAssignment(a)}
                          className="rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-200 hover:bg-sky-500/20"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedAssignment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Asset details
                </h3>
                <p className="text-xs text-slate-400">
                  Full information about this assigned asset.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-100">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Asset
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {selectedAssignment.assetName}
                </div>
                <div className="text-xs text-slate-400">
                  {selectedAssignment.assetType}
                  {selectedAssignment.serialNumber
                    ? ` · ${selectedAssignment.serialNumber}`
                    : ""}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Issued at
                  </div>
                  <div className="mt-1 text-slate-200">
                    {new Date(
                      selectedAssignment.assignedAt
                    ).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Returned at
                  </div>
                  <div className="mt-1 text-slate-200">
                    {selectedAssignment.returnedAt
                      ? new Date(
                          selectedAssignment.returnedAt
                        ).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Asset status
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        selectedAssignment.assetStatus === "ASSIGNED"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                          : selectedAssignment.assetStatus === "MAINTENANCE"
                            ? "bg-amber-500/10 text-amber-200 border border-amber-500/40"
                            : selectedAssignment.assetStatus === "RETIRED"
                              ? "bg-slate-500/10 text-slate-300 border border-slate-500/40"
                              : "bg-sky-500/10 text-sky-200 border border-sky-500/40"
                      }`}
                    >
                      {selectedAssignment.assetStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Assignment
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        selectedAssignment.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-500/10 text-slate-300 border border-slate-500/40"
                      }`}
                    >
                      {selectedAssignment.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAssignment.managerDescription && (
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Manager notes
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-xs text-slate-200">
                    {selectedAssignment.managerDescription}
                  </p>
                </div>
              )}

              {selectedAssignment.employeeDescription && (
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Your notes
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-xs text-slate-200">
                    {selectedAssignment.employeeDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editAssignment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Update assignment
                </h3>
                <p className="text-xs text-slate-400">
                  Set the status for this asset and add a short description.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditAssignment(null)}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-100">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Asset
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {editAssignment.assetName}
                </div>
                <div className="text-xs text-slate-400">
                  {editAssignment.assetType}
                  {editAssignment.serialNumber
                    ? ` · ${editAssignment.serialNumber}`
                    : ""}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="emp-status"
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Status
                </label>
                <select
                  id="emp-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/60"
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="DAMAGED">Damaged</option>
                  <option value="ON_HOLD">On hold</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="emp-desc"
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Description
                </label>
                <textarea
                  id="emp-desc"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/60"
                  placeholder="Describe the condition, issues, or any notes about this asset."
                />
              </div>

              {editError && (
                <p className="text-xs text-red-400">{editError}</p>
              )}

              <div className="mt-2 flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setEditAssignment(null)}
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-200 hover:bg-slate-800"
                  disabled={editSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={editSaving}
                  className="rounded-full bg-emerald-500 px-4 py-1 font-medium text-slate-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {editSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


