import { Inbox } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import RequestsTabs from './RequestsTabs'

export const dynamic = 'force-dynamic'

export default async function RequestsPage() {
  const user = await requireCurrentUser()

  const requests = await prisma.swapRequest.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    include: {
      sender: { select: { name: true } },
      receiver: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const incoming = requests
    .filter((request) => request.receiverId === user.id)
    .map((request) => ({
      id: request.id,
      name: request.sender.name,
      avatar: initials(request.sender.name),
      skill: request.skill || request.title,
      message: request.description || `I'd like to swap skills around ${request.skill || request.title}.`,
      status: request.status,
    }))

  const sent = requests
    .filter((request) => request.senderId === user.id)
    .map((request) => ({
      id: request.id,
      name: request.receiver?.name || 'Open community',
      avatar: initials(request.receiver?.name || 'Open community'),
      skill: request.skill || request.title,
      status: request.status,
    }))

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <Inbox className="h-4 w-4" />
            Workflow
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Requests</h1>
          <p className="mt-3 max-w-2xl text-muted">Review incoming swap requests and track the requests you have sent.</p>
        </div>

        <RequestsTabs incoming={incoming} sent={sent} />
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
