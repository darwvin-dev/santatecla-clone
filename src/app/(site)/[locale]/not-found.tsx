import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center shadow-inner"
        >
          <span className="text-2xl">🧭</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Pagina non trovata (404)
        </h1>

        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          Ops! La pagina che cerchi potrebbe essere stata spostata o non esiste
          più. Controlla l’URL oppure torna alla home.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-black text-white hover:bg-neutral-800 transition"
          >
            Torna alla Home
          </Link>
          <Link
            href="/apartments"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition"
          >
            Vedi tutti gli appartamenti
          </Link>
        </div>
      </div>
    </section>
  );
}
