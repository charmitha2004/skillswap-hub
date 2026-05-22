'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export type SearchUser = {
  id: number
  name: string
  role: string
  teachSkills: string[]
  learnSkills: string[]
}

export default function SearchClient({ users }: { users: SearchUser[] }) {
  const [query, setQuery] = useState('')

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return users

    return users.filter((user) =>
      [user.name, user.role, ...user.teachSkills, ...user.learnSkills]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    )
  }, [query, users])

  return (
    <>
      <label className="mb-8 flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-surface px-4 shadow-xl shadow-slate-950/20">
        <Search className="h-5 w-5 text-primary" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by name or skill"
          className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-muted"
        />
      </label>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredUsers.length ? (
          filteredUsers.map((user) => (
            <article key={user.id} className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-primary/40">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
                  {getInitials(user.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-sm text-muted">{user.role || 'Community member'}</p>
                </div>
              </div>

              <SkillGroup title="Can Teach" skills={user.teachSkills} tone="primary" />
              <SkillGroup title="Wants To Learn" skills={user.learnSkills} tone="secondary" />
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-surface p-8 text-center text-muted md:col-span-2 xl:col-span-3">
            No community members match that search.
          </div>
        )}
      </section>
    </>
  )
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function SkillGroup({ title, skills, tone }: { title: string; skills: string[]; tone: 'primary' | 'secondary' }) {
  const color = tone === 'primary' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary-light'

  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span key={skill} className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{skill}</span>
          ))
        ) : (
          <span className="text-sm text-muted">No skills listed.</span>
        )}
      </div>
    </div>
  )
}
