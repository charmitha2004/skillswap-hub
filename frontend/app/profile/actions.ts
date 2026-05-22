'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireCurrentUser } from '@/lib/auth'

type ProfileSnapshot = {
  id: number
  name: string
  email: string
  department: string
  teachSkills: string[]
  learnSkills: string[]
}

export type SaveProfileState = {
  ok: boolean
  message: string
  profile: ProfileSnapshot | null
}

const parseSkills = (entries: FormDataEntryValue[]) =>
  entries
    .map((entry) => String(entry).trim())
    .filter(Boolean)

export async function saveProfileAction(
  _prevState: SaveProfileState,
  formData: FormData
): Promise<SaveProfileState> {
  const user = await requireCurrentUser()

  const teachSkills = parseSkills(formData.getAll('teachSkills'))
  const learnSkills = parseSkills(formData.getAll('learnSkills'))

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      teachSkills,
      learnSkills,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      teachSkills: true,
      learnSkills: true,
    },
  })

  revalidatePath('/profile')
  revalidatePath('/dashboard')

  return {
    ok: true,
    message: 'Changes saved successfully',
    profile: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      department: updatedUser.role,
      teachSkills: updatedUser.teachSkills,
      learnSkills: updatedUser.learnSkills,
    },
  }
}
