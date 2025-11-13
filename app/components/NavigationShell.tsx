"use client";

import { useEffect, useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface NavigationShellProps {
  children: ReactNode;
}

const STORAGE_KEY = "duolist:admin:sidebar-collapsed";

export default function NavigationShell({ children }: NavigationShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const gridCols = collapsed ? "grid-cols-[72px_1fr]" : "grid-cols-[220px_1fr]";

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] bg-[var(--bg)] text-[var(--fg)]">
      <header className="bg-[rgba(11,15,23,0.95)] backdrop-blur border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="btn-neutral text-[13px]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
          <h1 className="m-0 text-[18px]">Duolist Admin</h1>
        </div>
        <div className="text-[12px] text-[var(--muted)]">Internal console</div>
      </header>

      <div className={`grid transition-[grid-template-columns] duration-200 ease-in-out ${gridCols} overflow-hidden`}>
        <aside className="bg-[var(--surface)] border-r border-[var(--border)] p-4 md:p-5 overflow-y-auto">
          <AdminSidebar collapsed={collapsed} />
        </aside>
        <main className="p-6 overflow-auto">{children}</main>
      </div>

      <footer className="px-5 py-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
        <p className="m-0">© {new Date().getFullYear()} DotsBright</p>
      </footer>
    </div>
  );
}
