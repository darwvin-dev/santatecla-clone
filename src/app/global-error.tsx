"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="it">
      <body className="min-h-screen flex items-center justify-center bg-white text-neutral-900 px-6">
        <section className="w-full max-w-xl text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-50 flex items-center justify-center shadow-inner"
          >
            <span className="text-2xl">🚧</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Errore interno del server
          </h1>

          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            Si è verificato un problema inatteso. Per favore riprova fra poco.
          </p>

          {error?.message ? (
            <details className="mt-5 text-left rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <summary className="cursor-pointer font-medium">
                Dettagli tecnici
              </summary>
              <pre className="mt-3 text-sm overflow-auto" dir="ltr">
                {error.message}
                {error.digest ? `\n#digest: ${error.digest}` : ""}
              </pre>
            </details>
          ) : null}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-black text-white hover:bg-neutral-800 transition"
            >
              Riprova
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition"
            >
              Vai alla Home
            </a>
          </div>
        </section>
      </body>
    </html>
  );
}
