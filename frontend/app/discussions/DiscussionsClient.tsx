'use client'

import Link from 'next/link'
import { MessageCircle, Send } from 'lucide-react'
import { sendPrivateMessage } from './actions'

export type ChatPartner = {
  id: number
  name: string
  role: string
  initials: string
  skill: string
}

export type ChatMessage = {
  id: number
  senderId: number
  receiverId: number
  content: string
  timestamp: string
}

export default function DiscussionsClient({
  currentUserId,
  partners,
  activePartner,
  messages,
}: {
  currentUserId: number
  partners: ChatPartner[]
  activePartner: ChatPartner | null
  messages: ChatMessage[]
}) {
  return (
    <section className="grid min-h-[620px] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-xl shadow-slate-950/20 lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-white/10 bg-white/60 lg:border-b-0 lg:border-r">
        <div className="border-b border-white/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Connected Partners</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Private Chats</h2>
        </div>

        <div className="max-h-[560px] overflow-y-auto p-3">
          {partners.length ? (
            partners.map((partner) => {
              const isActive = activePartner?.id === partner.id

              return (
                <Link
                  key={partner.id}
                  href={`/discussions?partner=${partner.id}`}
                  className={`flex gap-3 rounded-xl p-3 transition ${
                    isActive ? 'bg-primary/15 text-slate-950' : 'hover:bg-white/80'
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                    {partner.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-950">{partner.name}</p>
                    <p className="truncate text-xs text-muted">{partner.role || 'Skill partner'}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-primary">{partner.skill || 'Skill swap'}</p>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/70 p-5 text-center text-sm text-muted">
              Accept a swap request to unlock private discussions.
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-h-[620px] flex-col">
        {activePartner ? (
          <>
            <header className="flex items-center gap-3 border-b border-white/10 bg-white/70 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                {activePartner.initials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">{activePartner.name}</h2>
                <p className="text-sm text-muted">{activePartner.skill || 'Accepted swap partner'}</p>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4">
              {messages.length ? (
                messages.map((message) => {
                  const outgoing = message.senderId === currentUserId

                  return (
                    <div key={message.id} className={`flex ${outgoing ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          outgoing
                            ? 'rounded-br-md bg-primary text-white'
                            : 'rounded-bl-md border border-slate-200 bg-white text-slate-900'
                        }`}
                      >
                        <p className="leading-6">{message.content}</p>
                        <p className={`mt-1 text-right text-[0.68rem] font-semibold ${outgoing ? 'text-white/75' : 'text-slate-400'}`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex h-full items-center justify-center text-center text-muted">
                  <div>
                    <MessageCircle className="mx-auto mb-3 h-10 w-10 text-primary" />
                    <p className="font-semibold">No messages yet.</p>
                  </div>
                </div>
              )}
            </div>

            <form action={sendPrivateMessage} className="flex gap-3 border-t border-white/10 bg-white/80 p-4">
              <input type="hidden" name="receiverId" value={activePartner.id} />
              <input
                name="content"
                required
                placeholder={`Message ${activePartner.name}`}
                className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary"
              />
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-light">
                <Send className="h-4 w-4" />
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-muted">
            <div>
              <MessageCircle className="mx-auto mb-3 h-10 w-10 text-primary" />
              <p className="font-semibold">Choose an accepted partner to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function formatMessageTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}
