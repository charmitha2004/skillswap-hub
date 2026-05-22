import { BarChart3 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { requireCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ReportsCharts, { type RequestChartDatum, type SkillChartDatum } from './ReportsCharts'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const user = await requireCurrentUser()

  const [sentCount, receivedCount, acceptedCount, declinedCount, scheduledCount, messageCount] = await Promise.all([
    prisma.swapRequest.count({ where: { senderId: user.id } }),
    prisma.swapRequest.count({ where: { receiverId: user.id } }),
    prisma.swapRequest.count({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        status: 'accepted',
      },
    }),
    prisma.swapRequest.count({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        status: { in: ['declined', 'rejected'] },
      },
    }),
    prisma.session.count({
      where: {
        OR: [{ hostId: user.id }, { guestId: user.id }],
        status: 'scheduled',
      },
    }),
    prisma.message.count({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
    }),
  ])

  const skillData: SkillChartDatum[] = [
    { name: 'Teach Skills', value: user.teachSkills.filter(Boolean).length },
    { name: 'Learn Skills', value: user.learnSkills.filter(Boolean).length },
  ]

  const requestData: RequestChartDatum[] = [
    { name: 'Sent', value: sentCount },
    { name: 'Received', value: receivedCount },
    { name: 'Accepted', value: acceptedCount },
    { name: 'Declined', value: declinedCount },
  ]

  const metrics = [
    { label: 'Requests Sent', value: sentCount },
    { label: 'Requests Received', value: receivedCount },
    { label: 'Accepted Requests', value: acceptedCount },
    { label: 'Scheduled Sessions', value: scheduledCount },
    { label: 'Private Messages', value: messageCount },
  ]

  return (
    <main className="workspace-light min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <BarChart3 className="h-4 w-4" />
            Personal Analytics
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Reports</h1>
          <p className="mt-3 max-w-2xl text-muted">Live personal metrics for {user.name}, calculated from your current SwapSkill records.</p>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{metric.label}</p>
              <strong className="mt-4 block text-4xl text-slate-950">{metric.value}</strong>
            </article>
          ))}
        </section>

        <ReportsCharts skillData={skillData} requestData={requestData} />
      </section>
    </main>
  )
}
