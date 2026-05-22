import { CalendarDays } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ensurePlatformTables } from '@/lib/platformDb'
import SessionsClient, { type SessionCard } from './SessionsClient'

export const dynamic = 'force-dynamic'

export default async function SessionsPage() {
  const user = await requireCurrentUser()
  await ensurePlatformTables()
  await ensureAcceptedRequestSessions(user.id)

  const sessions = await prisma.session.findMany({
    where: {
      OR: [{ hostId: user.id }, { guestId: user.id }],
      request: {
        status: 'accepted',
      },
    },
    include: {
      host: { select: { id: true, name: true, role: true } },
      guest: { select: { id: true, name: true, role: true } },
      request: { select: { skill: true, title: true } },
    },
    orderBy: [{ status: 'asc' }, { scheduledAt: 'asc' }],
  })

  const sessionCards: SessionCard[] = sessions.map((session) => {
    const partner = session.hostId === user.id ? session.guest : session.host

    return {
      id: session.id,
      partnerName: partner.name,
      partnerRole: partner.role,
      partnerInitials: initials(partner.name),
      skill: session.skill || session.request?.skill || session.request?.title || 'Skill Swap Session',
      status: session.status,
      date: session.date ? session.date.toISOString().slice(0, 10) : null,
      time: session.time,
      scheduledAt: session.scheduledAt.toISOString(),
      meetingLink: session.meetingLink,
    }
  })

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <CalendarDays className="h-4 w-4" />
            Scheduled Swaps
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Sessions</h1>
          <p className="mt-3 max-w-2xl text-muted">Accepted partners appear here so both users can set a meeting time for their skill swap.</p>
        </div>

        <SessionsClient sessions={sessionCards} />
      </section>
    </main>
  )
}

async function ensureAcceptedRequestSessions(userId: number) {
  const acceptedRequests = await prisma.swapRequest.findMany({
    where: {
      status: 'accepted',
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sessions: { select: { id: true } },
    },
  })

  await Promise.all(
    acceptedRequests
      .filter((request) => request.receiverId && request.sessions.length === 0)
      .map((request) =>
        prisma.session.create({
          data: {
            requestId: request.id,
            hostId: request.senderId,
            guestId: request.receiverId as number,
            skill: request.skill || request.title,
            status: 'pending_schedule',
          },
        })
      )
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
