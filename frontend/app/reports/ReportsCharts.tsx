'use client'

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type SkillChartDatum = {
  name: string
  value: number
}

export type RequestChartDatum = {
  name: string
  value: number
}

const skillColors = ['#14B8A6', '#8B5CF6']
const requestColors = ['#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444']

export default function ReportsCharts({
  skillData,
  requestData,
}: {
  skillData: SkillChartDatum[]
  requestData: RequestChartDatum[]
}) {
  const hasSkillData = skillData.some((item) => item.value > 0)
  const hasRequestData = requestData.some((item) => item.value > 0)

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-2">
      <article className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20 sm:p-6">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-950">Teach vs Learn Skills</h2>
          <p className="mt-2 text-sm text-muted">Breakdown from your profile skill lists.</p>
        </div>

        {hasSkillData ? (
          <div className="grid gap-5 md:grid-cols-[1fr_180px] md:items-center">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={skillData} dataKey="value" nameKey="name" innerRadius={64} outerRadius={104} paddingAngle={4}>
                    {skillData.map((entry, index) => (
                      <Cell key={entry.name} fill={skillColors[index % skillColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend data={skillData} colors={skillColors} />
          </div>
        ) : (
          <EmptyChart text="Add teach and learn skills to see this chart." />
        )}
      </article>

      <article className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20 sm:p-6">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-950">Request Activity</h2>
          <p className="mt-2 text-sm text-muted">Requests sent, received, accepted, and declined.</p>
        </div>

        {hasRequestData ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {requestData.map((entry, index) => (
                    <Cell key={entry.name} fill={requestColors[index % requestColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart text="Send or receive swap requests to see this chart." />
        )}
      </article>
    </section>
  )
}

function ChartLegend({ data, colors }: { data: SkillChartDatum[]; colors: string[] }) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="text-sm font-semibold text-slate-700">{item.name}</span>
          </div>
          <span className="text-sm font-bold text-slate-950">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/60 p-8 text-center text-muted">
      {text}
    </div>
  )
}
