import { MessageSquare } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ensurePlatformTables } from '@/lib/platformDb'
import DiscussionsClient, { type ChatMessage, type ChatPartner } from './DiscussionsClient'

export const dynamic = 'force-dynamic'

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams?: { partner?: string }
}) {
  const user = await requireCurrentUser()
  await ensurePlatformTables()

  const acceptedRequests = await prisma.swapRequest.findMany({
    where: {
      status: 'accepted',
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const partnersById = new Map<number, ChatPartner>()

  for (const request of acceptedRequests) {
    if (!request.receiver) continue

    const partner = request.senderId === user.id ? request.receiver : request.sender

    if (!partnersById.has(partner.id)) {
      partnersById.set(partner.id, {
        id: partner.id,
        name: partner.name,
        role: partner.role,
        initials: initials(partner.name),
        skill: request.skill || request.title,
      })
    }
  }

  const partners = Array.from(partnersById.values())
  const requestedPartnerId = Number(searchParams?.partner)
  const activePartner =
    partners.find((partner) => partner.id === requestedPartnerId) ||
    partners[0] ||
    null

  const messages = activePartner
    ? await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id, receiverId: activePartner.id },
            { senderId: activePartner.id, receiverId: user.id },
          ],
        },
        orderBy: { timestamp: 'asc' },
      })
    : []

  const chatMessages: ChatMessage[] = messages.map((message) => ({
    id: message.id,
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    timestamp: message.timestamp.toISOString(),
  }))

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <MessageSquare className="h-4 w-4" />
            Private Messaging
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Discussions</h1>
          <p className="mt-3 max-w-2xl text-muted">Chat privately with accepted swap partners. Conversations are limited to confirmed skill connections.</p>
        </div>

        <DiscussionsClient
          currentUserId={user.id}
          partners={partners}
          activePartner={activePartner}
          messages={chatMessages}
        />
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
