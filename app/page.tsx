import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300/80 shadow-sm backdrop-blur">
            Internal Asset Management
          </span>
          <h1 className="text-balance text-4xl md:text-5xl font-semibold leading-tight">
            Modern dashboard for{" "}
            <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              company assets
            </span>
          </h1>
          <p className="max-w-xl text-sm md:text-base text-slate-300/90">
            Track laptops, licenses, and devices in one place. Built with
            Next.js 16, TypeScript, and a focus on security, auditability, and
            a delightful admin experience.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-100/90 shadow-sm backdrop-blur transition hover:border-slate-500 hover:bg-slate-900/80"
            >
              Sign in
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.16em] text-slate-400/80">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Role-based access
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Audit-ready logs
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              AI-ready architecture
            </span>
          </div>
        </div>

        <div className="relative h-full">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-sky-500/20 via-emerald-400/10 to-indigo-500/25 opacity-75 blur-3xl" />
          <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Live snapshot
                </p>
                <p className="mt-1 text-sm font-medium text-slate-50">
                  Asset health overview
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                98.4% up-to-date
              </span>
            </div>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 px-3 py-2.5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Assets in rotation
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    184
                    <span className="ml-2 text-[11px] font-medium text-emerald-400">
                      +12 this month
                    </span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-500" />
                  <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-sky-400 to-sky-500" />
                  <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-violet-400 to-violet-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-2.5">
                  <p className="text-[11px] text-slate-400">Assigned</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">
                    142
                  </p>
                  <p className="mt-0.5 text-[11px] text-emerald-400">
                    • healthy
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-2.5">
                  <p className="text-[11px] text-slate-400">In maintenance</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">
                    9
                  </p>
                  <p className="mt-0.5 text-[11px] text-amber-300">
                    • needs review
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-2.5">
                  <p className="text-[11px] text-slate-400">Unassigned</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">
                    33
                  </p>
                  <p className="mt-0.5 text-[11px] text-sky-300">
                    • available
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
                <span>Audit log streaming • SOC2-ready</span>
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

