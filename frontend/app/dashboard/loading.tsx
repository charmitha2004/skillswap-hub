export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-3">
          <div className="h-3 w-32 rounded-full bg-slate-200" />
          <div className="h-10 w-64 rounded-2xl bg-slate-200" />
          <div className="h-4 w-full max-w-2xl rounded-full bg-slate-200" />
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="h-4 w-24 rounded-full bg-slate-200" />
              <div className="mt-4 h-10 w-28 rounded-xl bg-slate-200" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="h-6 w-40 rounded-full bg-slate-200" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 4 }).map((__, row) => (
                  <div key={row} className="h-20 rounded-2xl bg-slate-100" />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}

