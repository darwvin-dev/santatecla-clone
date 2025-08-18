export default function Loading() {
  return (
    <section className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl bg-neutral-100 overflow-hidden"
              >
                <div className="h-full w-full animate-pulse bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-neutral-100 animate-pulse" />
          <div className="h-4 w-full rounded bg-neutral-100 animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-neutral-100 animate-pulse" />
          <div className="h-4 w-10/12 rounded bg-neutral-100 animate-pulse" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-4 w-24 rounded bg-neutral-100 animate-pulse" />
                <div className="h-5 w-14 rounded bg-neutral-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="pt-6 flex gap-3">
            <div className="h-11 w-36 rounded-xl bg-neutral-100 animate-pulse" />
            <div className="h-11 w-36 rounded-xl bg-neutral-100 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
