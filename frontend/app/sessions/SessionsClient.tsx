'use client'

import { CalendarDays, Clock3, ShieldCheck, Video, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { scheduleSession } from './actions'

export type SessionCard = {
  id: number
  partnerName: string
  partnerRole: string
  partnerInitials: string
  skill: string
  status: string
  date: string | null
  time: string | null
  scheduledAt: string
  meetingLink: string
}

export default function SessionsClient({ sessions }: { sessions: SessionCard[] }) {
  const [activeSession, setActiveSession] = useState<SessionCard | null>(null)
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  return (
    <>
      <section className="grid gap-4">
        {sessions.length ? (
          sessions.map((session) => (
            <article key={session.id} className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
                    {session.partnerInitials}
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{session.status.replace(/_/g, ' ')}</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">{session.partnerName}</h2>
                    <p className="mt-1 text-sm text-muted">{session.partnerRole || 'Skill partner'}</p>
                    <p className="mt-3 text-sm text-muted">
                      Skill swap: <span className="font-bold text-primary">{session.skill || 'General skill exchange'}</span>
                    </p>
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {session.date && session.time ? `${formatDate(session.date)} at ${session.time}` : 'Time not scheduled yet'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <button
                    onClick={() => setActiveSession(session)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 text-sm font-bold text-primary transition hover:bg-primary/20"
                  >
                    <Clock3 className="h-4 w-4" />
                    {session.date && session.time ? 'Reschedule' : 'Schedule'}
                  </button>

                  {session.date && session.time && session.meetingLink ? (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-light"
                    >
                      <Video className="h-4 w-4" />
                      Join Video Call
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-muted">
                      Meeting link pending
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-surface p-8 text-center text-muted">
            No accepted partners yet. Accept a swap request to create a session.
          </div>
        )}
      </section>

      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <form action={scheduleSession} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Schedule Session</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">{activeSession.partnerName}</h2>
                <p className="mt-1 text-sm text-muted">{activeSession.skill || 'Skill Swap Session'}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSession(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Close scheduler"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <input type="hidden" name="sessionId" value={activeSession.id} />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900">Date</span>
                <input
                  required
                  type="date"
                  name="date"
                  min={today}
                  defaultValue={activeSession.date || today}
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900">Time</span>
                <input
                  required
                  type="time"
                  name="time"
                  defaultValue={activeSession.time || '10:00'}
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-4">
              <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                A unique, secure video meeting link will be generated automatically once scheduled.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setActiveSession(null)}
                className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-light">
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
