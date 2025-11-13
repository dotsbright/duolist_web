"use client";

import Link from "next/link";

export default function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const items = [
    { href: "/admin", label: "Users", shorthand: "U" },
    // Future: { href: "/admin/analytics", label: "Analytics", shorthand: "A" },
  ];
  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-[var(--fg)] no-underline hover:bg-white/5"
        >
          <span className="w-8 h-8 rounded-[10px] bg-[var(--surface-2)] flex items-center justify-center font-semibold text-[var(--accent)] text-[15px]">
            {item.shorthand}
          </span>
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
}
