import "./admin.css";
import { Inter } from "next/font/google";
import AdminHeader from "../(site)/[locale]/components/admin/AdminHeader";
import AdminSidebar from "../(site)/[locale]/components/admin/AdminSidebar";
import { Toaster } from "sonner";

export const metadata = { title: "Admin" };
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body
        className={`${inter.className} min-h-dvh bg-slate-50 text-slate-900 antialiased`}
      >
        <a
          href="#admin-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
        >
          Salta al contenuto
        </a>

        <input id="admin-drawer" type="checkbox" className="peer hidden" />

        <aside
          className="fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transform bg-slate-900 text-white shadow-xl transition-transform duration-300 md:hidden peer-checked:translate-x-0"
          aria-label="Menu amministrazione"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="font-bold tracking-tight">Admin</div>
            <label
              htmlFor="admin-drawer"
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white hover:bg-white/10 active:bg-white/15"
              aria-label="Chiudi menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </label>
          </div>
          <div className="h-[calc(100dvh-56px)] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <AdminSidebar hideHeader />
          </div>
        </aside>

        <label
          htmlFor="admin-drawer"
          aria-hidden
          className="fixed inset-0 z-40 cursor-pointer bg-slate-900/40 opacity-0 transition md:hidden
                     pointer-events-none peer-checked:pointer-events-auto peer-checked:opacity-100 peer-checked:backdrop-blur-sm"
        />

        <div className="flex min-h-dvh">
          <aside className="hidden w-64 bg-slate-900 text-white md:flex">
            <div className="flex min-h-dvh w-full flex-col overflow-y-auto">
              <AdminSidebar />
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <div className="flex h-[60px] items-center justify-between px-4 md:px-6">
                <label
                  htmlFor="admin-drawer"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 md:hidden"
                  aria-label="Apri menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </label>

                <div className="min-w-0 flex-1">
                  <AdminHeader />
                </div>
              </div>
            </header>

            <main id="admin-main" className="flex-1 p-4 md:p-6">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
