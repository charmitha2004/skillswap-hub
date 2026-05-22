'use server'

import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ensurePlatformTables } from '@/lib/platformDb'

export async function scheduleSession(formData: FormData) {
  const user = await requireCurrentUser()
  const sessionId = Number(formData.get('sessionId'))
  const date = String(formData.get('date') || '').trim()
  const time = String(formData.get('time') || '').trim()

  if (!Number.isInteger(sessionId) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return
  }

  const scheduledAt = new Date(`${date}T${time}:00`)

  if (Number.isNaN(scheduledAt.getTime())) {
    return
  }

  await ensurePlatformTables()

  const meetingLink = `https://meet.jit.si/SwapSkill-${crypto.randomUUID()}`

  await prisma.session.updateMany({
    where: {
      id: sessionId,
      OR: [{ hostId: user.id }, { guestId: user.id }],
    },
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      time,
      scheduledAt,
      meetingLink,
      status: 'scheduled',
    },
  })

  revalidatePath('/sessions')
  revalidatePath('/dashboard')
  revalidatePath('/reports')
}
