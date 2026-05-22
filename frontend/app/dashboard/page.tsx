import { Activity, ArrowRightLeft, Send, Search, Users } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createSwapRequest } from '@/app/requests/actions'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const learnSkills = user.learnSkills.filter(Boolean)

  const [activeUsers, matchesFound, recentRequests, suggestedMatches, activeRequests] = await Promise.all([
    prisma.user.count(),
    learnSkills.length
      ? prisma.user.count({
          where: {
            id: { not: user.id },
            teachSkills: { hasSome: learnSkills },
          },
        })
      : Promise.resolve(0),
    prisma.swapRequest.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    learnSkills.length
      ? prisma.user.findMany({
          where: {
            id: { not: user.id },
            teachSkills: { hasSome: learnSkills },
          },
          select: {
            id: true,
            name: true,
            role: true,
            teachSkills: true,
            learnSkills: true,
          },
          orderBy: { updatedAt: 'desc' },
          take: 6,
        })
      : Promise.resolve([]),
    prisma.swapRequest.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        status: { in: ['pending', 'accepted'] },
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    }),
  ])

  const totalSkills = user.teachSkills.length + user.learnSkills.length
  const activeRequestUserIds = new Set(
    activeRequests
      .flatMap((request) => [request.senderId, request.receiverId])
      .filter((id): id is number => Boolean(id) && id !== user.id)
  )
  const suggestedMatch = suggestedMatches.find((match) => !activeRequestUserIds.has(match.id))
  const suggestedSkill = suggestedMatch?.teachSkills.find((skill) => learnSkills.includes(skill)) || ''

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
              <Activity className="h-4 w-4" />
              Live Workspace
            </p>
            <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">Welcome back, {user.name}</h1>
            <p className="mt-3 max-w-2xl text-slate-500">Your dashboard is powered directly by the PostgreSQL data attached to your current session.</p>
          </div>
          <Link href="/search" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-light">
            <Search className="h-4 w-4" />
            Find Skill Partners
          </Link>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <MetricCard
            title="Active Users"
            value={activeUsers}
            caption="Registered platform members"
            image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
          />
          <MetricCard
            title="Matches Found"
            value={matchesFound}
            caption="Users teaching skills you want"
            image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
          />
          <MetricCard
            title="Your Skills"
            value={totalSkills}
            caption="Teach and learn skills listed"
            image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Recent Activity</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Swap Requests</h2>
              </div>
              <Link href="/requests" className="text-sm font-bold text-primary hover:text-primary-light">View all</Link>
            </div>

            <div className="grid gap-3">
              {suggestedMatch && suggestedSkill && (
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                        {initials(suggestedMatch.name)}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Matched Profile</p>
                        <h3 className="mt-1 font-bold text-slate-950">{suggestedMatch.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Can teach <span className="font-bold text-primary">{suggestedSkill}</span>
                        </p>
                      </div>
                    </div>
                    <form action={createSwapRequest}>
                      <input type="hidden" name="receiverId" value={suggestedMatch.id} />
                      <input type="hidden" name="skill" value={suggestedSkill} />
                      <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-light">
                        <Send className="h-4 w-4" />
                        Send Swap Request
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {recentRequests.length ? (
                recentRequests.map((request) => (
                  <div key={request.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{request.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {request.sender.name} to {request.receiver?.name || 'Open community'}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase text-primary">{request.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="No active requests right now!" />
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Skill Profile</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Your Exchange Stack</h2>
            <SkillGroup title="Teaching" skills={user.teachSkills} tone="primary" />
            <SkillGroup title="Learning" skills={user.learnSkills} tone="secondary" />
            <Link href="/profile" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-900 transition hover:bg-slate-200">
              <ArrowRightLeft className="h-4 w-4" />
              Update Profile
            </Link>
          </article>
        </section>
      </section>
    </main>
  )
}

function MetricCard({ title, value, caption, image }: { title: string; value: number; caption: string; image: string }) {
  return (
    <article className="group relative min-h-[190px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-5 shadow-sm">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-[0.42] saturate-125 transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="relative z-10">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-200">{title}</p>
        <strong className="mt-3 block text-4xl font-bold !text-white">{value}</strong>
        <p className="mt-2 text-sm text-slate-200">{caption}</p>
      </div>
    </article>
  )
}

function SkillGroup({ title, skills, tone }: { title: string; skills: string[]; tone: 'primary' | 'secondary' }) {
  const color = tone === 'primary' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary-light'

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {skills.length ? skills.map((skill) => (
          <span key={skill} className={`rounded-full px-3 py-1.5 text-xs font-bold ${color}`}>{skill}</span>
        )) : <span className="text-sm text-slate-500">No skills added yet.</span>}
      </div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">{text}</div>
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
