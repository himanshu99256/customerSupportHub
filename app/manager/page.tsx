"use client";

import { useEffect, useState } from "react";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Asset = {
  id: number;
  name: string;
  type: string;
  serialNumber: string | null;
  status: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "RETIRED";
};

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
  assetStatus: Asset["status"];
  employeeName: string;
  employeeEmail: string;
  managerDescription?: string | null;
  employeeDescription?: string | null;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function ManagerScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [assetForm, setAssetForm] = useState({
    name: "",
    type: "",
    serialNumber: "",
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">(
    ""
  );
  const [selectedAssetId, setSelectedAssetId] = useState<number | "">("");
  const [assignmentDescription, setAssignmentDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUpdate, setSelectedUpdate] = useState<Assignment | null>(null);

  const availableAssets = assets.filter((a) => a.status === "AVAILABLE");

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

  async function loadData() {
    try {
      setError("");
      const [empRes, assetRes, assignRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/assets"),
        fetch("/api/asset-assignments"),
      ]);

      const [empData, assetData, assignData] = await Promise.all([
        empRes.json(),
        assetRes.json(),
        assignRes.json(),
      ]);

      if (!empRes.ok) throw new Error(empData.error || "Failed to load users");
      if (!assetRes.ok)
        throw new Error(assetData.error || "Failed to load assets");
      if (!assignRes.ok)
        throw new Error(assignData.error || "Failed to load assignments");

      setEmployees(empData.employees || []);
      setAssets(assetData.assets || []);
      setAssignments(assignData.assignments || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create asset");
      }

      setSuccess("Asset created");
      setAssetForm({ name: "", type: "", serialNumber: "" });
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to create asset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedEmployeeId || !selectedAssetId) {
      setError("Please select both employee and asset");
      return;
    }

    if (!currentUser) {
      setError("You must be signed in as a manager to assign assets");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/asset-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAssetId,
          userId: selectedEmployeeId,
          assignedById: currentUser.id,
          managerDescription: assignmentDescription || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign asset");
      }

      setSuccess("Asset assigned");
      setSelectedAssetId("");
      setSelectedEmployeeId("");
      setAssignmentDescription("");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to assign asset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnAsset = async (
    assignmentId: number,
    condition: "OK" | "DAMAGED"
  ) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/asset-assignments/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, condition }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update asset status");
      }

      setSuccess(
        condition === "DAMAGED"
          ? "Asset marked as returned damaged"
          : "Asset returned to pool"
      );
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to update asset status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Manager · Asset Control
          </h1>
          <p className="text-sm text-slate-300/80">
            Assign laptops and licenses to employees and track their lifecycle
            from a single place.
          </p>
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
              {success}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr),minmax(0,1.1fr)]">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/20 via-emerald-400/10 to-indigo-500/25 opacity-60 blur-2xl" />
          <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-50">
                  Create asset
                </h2>
                <p className="text-xs text-slate-400">
                  Add laptops, monitors, software seats and more.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4 text-sm">
              <div className="space-y-2">
                <label
                  htmlFor="asset-name"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Asset name
                </label>
                <input
                  id="asset-name"
                  name="name"
                  value={assetForm.name}
                  onChange={(e) =>
                    setAssetForm({ ...assetForm, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                  placeholder="MacBook Pro 14” • i7 • 16GB"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="asset-type"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Type
                  </label>
                  <input
                    id="asset-type"
                    name="type"
                    value={assetForm.type}
                    onChange={(e) =>
                      setAssetForm({ ...assetForm, type: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                    placeholder="Laptop / License / Monitor"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="asset-serial"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Serial / License key (optional)
                  </label>
                  <input
                    id="asset-serial"
                    name="serialNumber"
                    value={assetForm.serialNumber}
                    onChange={(e) =>
                      setAssetForm({
                        ...assetForm,
                        serialNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                    placeholder="SN-ABC-123 / XXXX-XXXX-XXXX"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Saving..." : "Save asset"}
              </button>

              <p className="mt-2 text-[11px] text-slate-400">
                New assets start as{" "}
                <span className="font-semibold text-sky-300">AVAILABLE</span>{" "}
                and move to{" "}
                <span className="font-semibold text-emerald-300">ASSIGNED</span>{" "}
                when linked to an employee.
              </p>
            </form>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-sky-400/10 to-violet-500/20 opacity-60 blur-2xl" />
          <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-50">
                  Assign asset
                </h2>
                <p className="text-xs text-slate-400">
                  Issue an available asset to an employee.
                </p>
              </div>
            </div>

            <form onSubmit={handleAssignAsset} className="space-y-4 text-sm">
              <div className="space-y-2">
                <label
                  htmlFor="employee"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Employee
                </label>
                <select
                  id="employee"
                  value={selectedEmployeeId}
                  onChange={(e) =>
                    setSelectedEmployeeId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/60"
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} · {emp.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="asset"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Asset to assign
                </label>
                <select
                  id="asset"
                  value={selectedAssetId}
                  onChange={(e) =>
                    setSelectedAssetId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/60"
                >
                  <option value="">
                    {availableAssets.length === 0
                      ? "No available assets"
                      : "Select available asset"}
                  </option>
                  {availableAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} · {asset.type}
                      {asset.serialNumber ? ` · ${asset.serialNumber}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="assignment-notes"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Description (optional)
                </label>
                <textarea
                  id="assignment-notes"
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 shadow-sm outline-none ring-0 transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/60"
                  placeholder="Why this asset is being assigned, special instructions, etc."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || availableAssets.length === 0}
                className="mt-1 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Processing..." : "Assign asset"}
              </button>

              <p className="mt-2 text-[11px] text-slate-400">
                Assignment will create an{" "}
                <span className="font-semibold text-emerald-300">ACTIVE</span>{" "}
                record and mark the asset as{" "}
                <span className="font-semibold text-emerald-300">ASSIGNED</span>
                .
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-slate-500/10 via-sky-500/10 to-emerald-500/15 opacity-40 blur-2xl" />
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Lifecycle activity
              </h2>
              <p className="text-xs text-slate-400">
                Recent assignments and returns across your fleet.
              </p>
            </div>
          </div>

          {assignments.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No assignments yet. Create an asset and assign it to an employee
              to see activity here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-200/90">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-3 py-2 font-medium">Asset</th>
                    <th className="px-3 py-2 font-medium">Employee</th>
                    <th className="px-3 py-2 font-medium">Issued</th>
                    <th className="px-3 py-2 font-medium">Returned</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium text-center">Updates</th>
                    <th className="px-3 py-2 font-medium text-right">
                      Lifecycle
                    </th>
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
                            a.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                              : "bg-slate-500/10 text-slate-300 border border-slate-500/40"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        {a.status === "ACTIVE" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleReturnAsset(a.id, "OK")}
                              className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/20"
                            >
                              Mark returned
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReturnAsset(a.id, "DAMAGED")}
                              className="rounded-full border border-amber-500/50 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-200 hover:bg-amber-500/20"
                            >
                              Mark damaged
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {a.employeeDescription ? (
                          <button
                            type="button"
                            onClick={() => setSelectedUpdate(a)}
                            title="View employee update"
                            className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-sky-400/90 hover:scale-110"
                          />
                        ) : (
                          <span className="inline-block h-3 w-3 rounded-full bg-transparent" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedUpdate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">Employee update</h3>
                <p className="text-xs text-slate-400">Details submitted by the employee.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUpdate(null)}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-100">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Asset</div>
                <div className="mt-1 text-sm font-semibold">{selectedUpdate.assetName}</div>
                <div className="text-xs text-slate-400">{selectedUpdate.assetType}{selectedUpdate.serialNumber ? ` · ${selectedUpdate.serialNumber}` : ""}</div>
              </div>

              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Submitted by</div>
                <div className="mt-1 text-sm">{selectedUpdate.employeeName}</div>
                <div className="text-xs text-slate-400">{selectedUpdate.employeeEmail}</div>
              </div>

              {(() => {
                const combined = selectedUpdate.employeeDescription || "";
                const match = combined.match(/^Status:\s*(.*)\n([\s\S]*)$/);
                const status = match ? match[1] : "N/A";
                const desc = match ? match[2] : combined;
                return (
                  <>
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Status</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${status === "DAMAGED" ? "bg-amber-500/10 text-amber-200 border border-amber-500/40" : status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40" : "bg-slate-500/10 text-slate-300 border border-slate-500/40"}`}>
                          {status}
                        </span>
                      </div>
                    </div>

                    {desc && (
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Description</div>
                        <p className="mt-1 whitespace-pre-wrap text-xs text-slate-200">{desc}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


