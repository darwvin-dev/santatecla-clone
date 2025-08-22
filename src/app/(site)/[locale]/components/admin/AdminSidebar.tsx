"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

type Locale = "it" | "en";
type NavItem = { href: string; label: string; exact?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/homepage", label: "HomePage" },
  { href: "/admin/gestione", label: "Gestione" },
  { href: "/admin/homepage/experiences", label: "Experiences" },
  { href: "/admin/apartments", label: "Appartamenti" },
];

function splitLocale(pathname: string): { locale: Locale; rest: string } {
  const pathOnly = pathname.split("#")[0].split("?")[0];
  const segs = pathOnly.split("/").filter(Boolean);
  const first = (segs[0] as Locale) || "it";
  const isLocale = first === "it" || first === "en";
  const locale: Locale = isLocale ? first : "it";
  const rest = "/" + (isLocale ? segs.slice(1).join("/") : segs.join("/"));
  return { locale, rest: rest === "//" ? "/" : rest };
}

function withLocale(href: string, locale: Locale): string {
  const clean = href.split("#")[0].split("?")[0];
  const segs = clean.split("/").filter(Boolean);
  if (segs[0] === "it" || segs[0] === "en") return clean; 
  return `/${locale}${clean.startsWith("/") ? "" : "/"}${clean}`;
}

function normalizePathIgnoringLocale(pathname: string): string {
  const { rest } = splitLocale(pathname);
  const trimmed = rest !== "/" && rest.endsWith("/") ? rest.slice(0, -1) : rest;
  return trimmed || "/";
}

function isActive(pathname: string, item: NavItem): boolean {
  const current = normalizePathIgnoringLocale(pathname);
  const target = normalizePathIgnoringLocale(item.href);
  if (item.exact) return current === target;
  return current === target || current.startsWith(target + "/");
}

export default function AdminSidebar({
  className = "",
  hideHeader = false,
}: {
  className?: string;
  hideHeader?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { locale, rest } = useMemo(() => splitLocale(pathname), [pathname]);

  const closeDrawerIfMobile = useCallback(() => {
    const cb = document.getElementById(
      "admin-drawer"
    ) as HTMLInputElement | null;
    if (cb && cb.checked) cb.checked = false;
  }, []);

  const switchLocale = useCallback(
    (next: Locale) => {
      // همان مسیر فعلی، فقط با زبان جدید
      const nextPath = `/${next}${rest === "/" ? "" : rest}`;
      router.replace(nextPath);
    },
    [router, rest]
  );

  return (
    <aside
      className={[
        "flex h-full flex-col bg-slate-900 text-white",
        className,
      ].join(" ")}
      role="navigation"
      aria-label="Pannello di amministrazione"
    >
      {!hideHeader && (
        <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">Pannello</h2>

          {/* Language Switch */}
          <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
            {(["it", "en"] as Locale[]).map((loc) => {
              const active = loc === locale;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => switchLocale(loc)}
                  className={[
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition",
                    active
                      ? "bg-white text-slate-900"
                      : "text-zinc-300 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {loc.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const href = withLocale(item.href, locale);
          return (
            <NavLink
              key={item.href}
              href={href}
              active={active}
              onClick={closeDrawerIfMobile}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-3">
        <Link
          href={withLocale("/", locale)}
          onClick={closeDrawerIfMobile}
          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-300 transition
                     hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <IconExternal />
          <span>{locale === "it" ? "Torna al sito" : "Back to site"}</span>
        </Link>
      </div>
    </aside>
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
        active
          ? "bg-white text-slate-900"
          : "text-zinc-300 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <IconDot active={!!active} />
      <span className="truncate">{children}</span>
    </Link>
  );
}

function IconDot({ active }: { active: boolean }) {
  return active ? (
    <svg
      viewBox="0 0 24 24"
      className="h-2.5 w-2.5 fill-current"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className="h-2.5 w-2.5 text-zinc-400"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="currentColor"
        className="opacity-60"
      />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
      focusable="false"
    >
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
