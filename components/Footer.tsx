import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-slate-300 fixed left-0 right-0 bottom-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 ring-1 ring-slate-700 text-slate-100 font-semibold">HR</div>
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-slate-100">Himanshu Ranpariya</span>
            <span className="text-xs text-slate-400">Asset Management · Creator</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/himanshu-ranpariya-37a5ab285/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 bg-slate-800/40 hover:bg-slate-800/60 transition"
            aria-label="Himanshu LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-14h4v2" />
              <rect x="2" y="9" width="4" height="11" rx="1" />
            </svg>
            <span className="text-sm text-slate-200">LinkedIn</span>
          </a>

          <a
            href="https://github.com/himanshu99256?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 bg-slate-800/40 hover:bg-slate-800/60 transition"
            aria-label="Himanshu GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.166 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.1 2.94.84.09-.66.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.338 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.33-.01 2.41-.01 2.74 0 .26.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
            </svg>
            <span className="text-sm text-slate-200">GitHub</span>
          </a>
        </div>

        <div className="text-xs text-slate-500">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
