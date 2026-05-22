import Link from 'next/link'
import { Send, Sparkles, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createSwapRequest } from '@/app/requests/actions'

export const dynamic = 'force-dynamic'

export default async function MatchesPage() {
  const user = await requireCurrentUser()
  const wantedSkills = user.learnSkills.filter(Boolean)

  const matches = wantedSkills.length
    ? await prisma.user.findMany({
        where: {
          id: { not: user.id },
          teachSkills: { hasSome: wantedSkills },
        },
        select: {
          id: true,
          name: true,
          role: true,
          teachSkills: true,
          learnSkills: true,
        },
        orderBy: { updatedAt: 'desc' },
      })
    : []
  const existingRequests = matches.length
    ? await prisma.swapRequest.findMany({
        where: {
          OR: [
            { senderId: user.id, receiverId: { in: matches.map((match) => match.id) } },
            { receiverId: user.id, senderId: { in: matches.map((match) => match.id) } },
          ],
        },
        select: {
          senderId: true,
          receiverId: true,
          status: true,
        },
        orderBy: { updatedAt: 'desc' },
      })
    : []
  const requestByPartnerId = new Map(
    existingRequests.map((request) => [
      request.senderId === user.id ? request.receiverId : request.senderId,
      request,
    ])
  )

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-4 w-4" />
            Matchmaking
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Your Skill Matches</h1>
          <p className="mt-3 max-w-2xl text-muted">These members can teach skills from your learning list. The overlap is calculated live from your profile.</p>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {matches.length ? (
            matches.map((match) => {
              const overlap = match.teachSkills.filter((skill) => wantedSkills.includes(skill))
              const primarySkill = overlap[0] || ''
              const existingRequest = requestByPartnerId.get(match.id)
              const status = existingRequest?.status.toLowerCase()

              return (
                <article key={match.id} className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-primary/40">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
                      {initials(match.name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{match.name}</h2>
                      <p className="text-sm text-muted">{match.role || 'Community member'}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      <Users className="h-4 w-4" />
                      They can teach you
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {overlap.map((skill) => (
                        <span key={skill} className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">They want to learn</p>
                    <div className="flex flex-wrap gap-2">
                      {match.learnSkills.length ? match.learnSkills.map((skill) => (
                        <span key={skill} className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary-light">{skill}</span>
                      )) : <span className="text-sm text-muted">No learning goals listed.</span>}
                    </div>
                  </div>

                  <div className="mt-5">
                    {status === 'pending' ? (
                      <Link href="/requests" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400/15 px-4 text-sm font-bold text-amber-700 transition hover:bg-amber-400/25">
                        Request Pending
                      </Link>
                    ) : status === 'accepted' ? (
                      <Link href="/sessions" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-500/15 px-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/25">
                        Accepted Partner
                      </Link>
                    ) : (
                      <form action={createSwapRequest}>
                        <input type="hidden" name="receiverId" value={match.id} />
                        <input type="hidden" name="skill" value={primarySkill} />
                        <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-light">
                          <Send className="h-4 w-4" />
                          Send Swap Request
                        </button>
                      </form>
                    )}
                  </div>
                </article>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-surface p-8 text-center text-muted md:col-span-2 xl:col-span-3">
              No matches yet. Add skills you want to learn on your profile to unlock live matches.
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
