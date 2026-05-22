'use server'

import { revalidatePath } from 'next/cache'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ensurePlatformTables } from '@/lib/platformDb'

export async function sendPrivateMessage(formData: FormData) {
  const user = await requireCurrentUser()
  const receiverId = Number(formData.get('receiverId'))
  const content = String(formData.get('content') || '').trim()

  if (!Number.isInteger(receiverId) || receiverId === user.id || !content) {
    return
  }

  const acceptedConnection = await prisma.swapRequest.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { senderId: user.id, receiverId },
        { senderId: receiverId, receiverId: user.id },
      ],
    },
    select: { id: true },
  })

  if (!acceptedConnection) {
    return
  }

  await ensurePlatformTables()

  await prisma.message.create({
    data: {
      senderId: user.id,
      receiverId,
      content,
    },
  })

  revalidatePath('/discussions')
}
