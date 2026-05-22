export default function Loading() {
  return (
    <main className="workspace-light min-h-screen px-4 pt-28">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-surface p-8 text-center text-muted">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-light border-t-transparent" />
        Loading leaderboard...
      </div>
    </main>
  )
}
