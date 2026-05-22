import { Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import SearchClient from './SearchClient'

export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  const user = await requireCurrentUser()
  const users = await prisma.user.findMany({
    where: { id: { not: user.id } },
    select: {
      id: true,
      name: true,
      role: true,
      teachSkills: true,
      learnSkills: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <Users className="h-4 w-4" />
            Community
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Search Members</h1>
          <p className="mt-3 max-w-2xl text-muted">Browse live SwapSkill users and filter by name, teaching skills, or learning goals.</p>
        </div>

        <SearchClient users={users} />
      </section>
    </main>
  )
}
