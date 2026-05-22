import ProfileClient from './ProfileClient'
import { requireCurrentUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await requireCurrentUser()

  return (
    <>
      <Navbar />
      <ProfileClient
        initialProfile={{
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.role,
          teachSkills: user.teachSkills,
          learnSkills: user.learnSkills,
        }}
      />
    </>
  )
}
