// /app/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

type NavItem = { href: string; label: string; exact?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/homepage", label: "HomePage" },
  { href: "/admin/gestione", label: "Gestione" },
  { href: "/admin/homepage/experiences", label: "Experiences" },
  { href: "/admin/apartments", label: "Appartamenti" },
];

export default function AdminSidebar({
  className = "",
  hideHeader = false,
}: {
  className?: string;
  hideHeader?: boolean;
}) {
  const pathname = usePathname();

  const closeDrawerIfMobile = useCallback(() => {
    const cb = document.getElementById("admin-drawer") as HTMLInputElement | null;
    if (cb && cb.checked) cb.checked = false;
  }, []);

  return (
    <div className={["flex h-full flex-col bg-slate-900 text-white", className].join(" ")} role="navigation" aria-label="Pannello di amministrazione">
      {!hideHeader && (
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-bold tracking-tight">Pannello</h2>
        </div>
      )}

      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            active={isActive(pathname, item)}
            onClick={closeDrawerIfMobile}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 p-3">
        <Link
          href="/"
          onClick={closeDrawerIfMobile}
          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-300 transition
                     hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <IconExternal />
          <span>Torna al sito</span>
        </Link>
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        active ? "bg-white text-slate-900" : "text-zinc-300 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <IconDot active={!!active} />
      <span className="truncate">{children}</span>
    </Link>
  );
}

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href;
}

function IconDot({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current">
      <circle cx="12" cy="12" r="5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-zinc-400">
      <circle cx="12" cy="12" r="4" fill="currentColor" className="opacity-60" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M14 3h7v7M21 3l-9 9M17 21H7a2 2 0 0 1-2-2V7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
