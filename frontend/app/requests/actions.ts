'use server'

import { revalidatePath } from 'next/cache'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ensurePlatformTables } from '@/lib/platformDb'

const REQUEST_STATUSES = ['pending', 'accepted', 'declined'] as const

type RequestStatus = (typeof REQUEST_STATUSES)[number]

function revalidateRequestSurfaces() {
  revalidatePath('/requests')
  revalidatePath('/matches')
  revalidatePath('/dashboard')
  revalidatePath('/reports')
  revalidatePath('/sessions')
}

export async function createSwapRequest(formData: FormData) {
  const user = await requireCurrentUser()
  const receiverId = Number(formData.get('receiverId'))
  const skill = String(formData.get('skill') || '').trim()
  const note = String(formData.get('message') || '').trim()

  if (!Number.isInteger(receiverId) || receiverId === user.id) return

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: {
      id: true,
      name: true,
      teachSkills: true,
    },
  })

  if (!receiver) return

  const verifiedSkill =
    skill && user.learnSkills.includes(skill) && receiver.teachSkills.includes(skill)
      ? skill
      : user.learnSkills.find((candidate) => receiver.teachSkills.includes(candidate)) || ''

  if (!verifiedSkill) return

  const existingRequest = await prisma.swapRequest.findFirst({
    where: {
      OR: [
        { senderId: user.id, receiverId },
        { senderId: receiverId, receiverId: user.id },
      ],
      status: { in: ['pending', 'accepted'] },
    },
    select: { id: true },
  })

  if (existingRequest) {
    revalidateRequestSurfaces()
    return
  }

  await prisma.swapRequest.create({
    data: {
      senderId: user.id,
      receiverId,
      title: `${verifiedSkill} skill swap`,
      skill: verifiedSkill,
      description: note || `${user.name} wants to learn ${verifiedSkill} from ${receiver.name}.`,
      status: 'pending',
    },
  })

  revalidateRequestSurfaces()
}

export async function acceptSwapRequest(formData: FormData) {
  await setRequestStatus(formData, 'accepted')
}

export async function declineSwapRequest(formData: FormData) {
  await setRequestStatus(formData, 'declined')
}

export async function updateRequestStatus(formData: FormData) {
  const status = String(formData.get('status')).toLowerCase()

  if (!REQUEST_STATUSES.includes(status as RequestStatus)) return

  await setRequestStatus(formData, status as RequestStatus)
}

async function setRequestStatus(formData: FormData, status: RequestStatus) {
  const user = await requireCurrentUser()
  const requestId = Number(formData.get('requestId'))

  if (!Number.isInteger(requestId)) return

  const request = await prisma.swapRequest.findFirst({
    where: {
      id: requestId,
      receiverId: user.id,
      status: 'pending',
    },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      skill: true,
      title: true,
    },
  })

  if (!request) return

  await prisma.swapRequest.update({
    where: { id: request.id },
    data: { status },
  })

  if (status === 'accepted') {
    await ensurePlatformTables()

    const existingSession = await prisma.session.findFirst({
      where: { requestId: request.id },
      select: { id: true },
    })

    if (!existingSession && request.receiverId) {
      await prisma.session.create({
        data: {
          requestId: request.id,
          hostId: request.senderId,
          guestId: request.receiverId,
          skill: request.skill || request.title,
          status: 'pending_schedule',
        },
      })
    }
  }

  revalidateRequestSurfaces()
}
