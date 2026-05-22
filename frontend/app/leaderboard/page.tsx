import { Trophy } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const currentUser = await requireCurrentUser()
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      teachSkills: true,
      learnSkills: true,
    },
  })

  const rankedUsers = users
    .map((user) => ({
      ...user,
      points: user.teachSkills.length * 10 + user.learnSkills.length * 4,
    }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
    .slice(0, 10)

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <Trophy className="h-4 w-4" />
            Contribution Points
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Leaderboard</h1>
          <p className="mt-3 max-w-2xl text-muted">Ranked by live profile contribution: teaching skills and learning goals listed by each user.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-xl shadow-slate-950/20">
          {rankedUsers.length ? rankedUsers.map((user, index) => {
            const isCurrentUser = user.id === currentUser.id

            return (
              <div key={user.id} className={`grid gap-4 border-b border-white/10 p-5 last:border-b-0 sm:grid-cols-[70px_1fr_130px] sm:items-center ${isCurrentUser ? 'bg-primary/10' : 'bg-transparent'}`}>
                <div className="text-3xl font-bold text-primary">#{index + 1}</div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="mt-1 text-sm text-muted">{user.role || 'Community member'}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {user.teachSkills.length} teaching skills · {user.learnSkills.length} learning goals
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3 text-center">
                  <strong className="block text-2xl">{user.points}</strong>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Points</span>
                </div>
              </div>
            )
          }) : (
            <div className="p-8 text-center text-muted">No leaderboard data yet.</div>
          )}
        </div>
      </section>
    </main>
  )
}
