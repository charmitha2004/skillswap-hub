'use client'

import { Check, Clock3, Send, X } from 'lucide-react'
import { useState } from 'react'
import { acceptSwapRequest, declineSwapRequest } from './actions'

type IncomingRequest = {
  id: number
  name: string
  avatar: string
  skill: string
  message: string
  status: string
}

type SentRequest = {
  id: number
  name: string
  avatar: string
  skill: string
  status: string
}

export default function RequestsTabs({
  incoming,
  sent,
}: {
  incoming: IncomingRequest[]
  sent: SentRequest[]
}) {
  const [activeTab, setActiveTab] = useState<'incoming' | 'sent'>('incoming')

  return (
    <>
      <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-surface p-1">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`min-h-11 rounded-xl px-5 text-sm font-bold transition ${activeTab === 'incoming' ? 'bg-primary/15 text-primary' : 'text-muted hover:text-primary'}`}
        >
          Incoming Requests
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`min-h-11 rounded-xl px-5 text-sm font-bold transition ${activeTab === 'sent' ? 'bg-primary/15 text-primary' : 'text-muted hover:text-primary'}`}
        >
          Sent Requests
        </button>
      </div>

      {activeTab === 'incoming' ? (
        <section className="grid gap-4">
          {incoming.length ? incoming.map((request) => (
            <article key={request.id} className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <Avatar label={request.avatar} />
                  <div>
                    <h2 className="text-xl font-bold text-white">{request.name}</h2>
                    <p className="mt-1 text-sm text-muted">Requested skill: <span className="font-bold text-primary">{request.skill}</span></p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{request.message}</p>
                    <StatusBadge status={request.status} />
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-3">
                    <form action={acceptSwapRequest}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <button className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-light">
                        <Check className="h-4 w-4" />
                        Accept
                      </button>
                    </form>
                    <form action={declineSwapRequest}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <button className="flex min-h-11 items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 text-sm font-bold text-red-700 transition hover:bg-red-500/20">
                        <X className="h-4 w-4" />
                        Decline
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </article>
          )) : <EmptyState text="No active requests right now!" />}
        </section>
      ) : (
        <section className="grid gap-4">
          {sent.length ? sent.map((request) => (
            <article key={request.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar label={request.avatar} />
                <div>
                  <h2 className="text-xl font-bold text-white">{request.name}</h2>
                  <p className="text-sm text-muted">You requested: <span className="font-bold text-primary">{request.skill}</span></p>
                </div>
              </div>
              <StatusBadge status={request.status} />
            </article>
          )) : <EmptyState text="No sent requests yet." />}
        </section>
      )}
    </>
  )
}

function Avatar({ label }: { label: string }) {
  return <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">{label}</div>
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const styles = normalized === 'accepted'
    ? 'bg-emerald-500/15 text-emerald-700'
    : normalized === 'declined' || normalized === 'rejected'
      ? 'bg-red-500/15 text-red-700'
      : 'bg-amber-400/15 text-amber-700'

  return (
    <span className={`mt-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase ${styles}`}>
      {normalized === 'pending' ? <Clock3 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
      {status}
    </span>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-surface p-8 text-center text-muted">{text}</div>
}
