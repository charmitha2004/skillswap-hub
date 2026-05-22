'use client'

import { Plus, Save, UserRound, X } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useFormState } from 'react-dom'
import { saveProfileAction, type SaveProfileState } from './actions'

type ProfileData = {
  id: number
  name: string
  email: string
  department: string
  teachSkills: string[]
  learnSkills: string[]
}

export default function ProfileClient({ initialProfile }: { initialProfile: ProfileData }) {
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile)
  const [teachSkills, setTeachSkills] = useState<string[]>(initialProfile.teachSkills)
  const [learnSkills, setLearnSkills] = useState<string[]>(initialProfile.learnSkills)
  const [teachInput, setTeachInput] = useState('')
  const [learnInput, setLearnInput] = useState('')
  const [loading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveButtonLabel, setSaveButtonLabel] = useState('Save Changes')
  const [savedMessage, setSavedMessage] = useState('')
  const [error, setError] = useState('')
  const [actionState, formAction] = useFormState<SaveProfileState, FormData>(saveProfileAction, {
    ok: false,
    message: '',
    profile: null,
  })

  useEffect(() => {
    if (actionState.ok && actionState.profile) {
      setProfile(actionState.profile)
      setTeachSkills(Array.isArray(actionState.profile.teachSkills) ? actionState.profile.teachSkills : [])
      setLearnSkills(Array.isArray(actionState.profile.learnSkills) ? actionState.profile.learnSkills : [])
      setSavedMessage(actionState.message)
      setIsSaving(false)
      setSaveButtonLabel('Saved!')

      const revertTimer = window.setTimeout(() => {
        setSaveButtonLabel('Save Changes')
      }, 1500)

      return () => window.clearTimeout(revertTimer)
    }

    if (actionState.message && !actionState.ok) {
      setError(actionState.message)
      setIsSaving(false)
      setSaveButtonLabel('Save Changes')
    }
  }, [actionState])

  useEffect(() => {
    if (!savedMessage) return
    const timeout = window.setTimeout(() => setSavedMessage(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [savedMessage])

  const initials = useMemo(() => {
    const name = profile?.name?.trim() || ''
    if (!name) return 'U'
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [profile?.name])

  const addSkill = (event: FormEvent<HTMLFormElement>, type: 'teach' | 'learn') => {
    event.preventDefault()
    const value = (type === 'teach' ? teachInput : learnInput).trim()
    if (!value) return

    if (type === 'teach') {
      setTeachSkills((current) => (current.includes(value) ? current : [...current, value]))
      setTeachInput('')
    } else {
      setLearnSkills((current) => (current.includes(value) ? current : [...current, value]))
      setLearnInput('')
    }
  }

  const removeSkill = (type: 'teach' | 'learn', skill: string) => {
    if (type === 'teach') {
      setTeachSkills((current) => current.filter((item) => item !== skill))
    } else {
      setLearnSkills((current) => current.filter((item) => item !== skill))
    }
  }

  const handleSaveSubmit = () => {
    if (isSaving) return
    setIsSaving(true)
    setError('')
    setSaveButtonLabel('Saving...')
  }

  return (
    <main className="workspace-light min-h-screen px-4 pb-8 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-light border-t-transparent" />
            <span className="ml-3 text-muted">Loading profile...</span>
          </div>
        ) : profile ? (
          <>
            <div className="mb-8 rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl shadow-slate-950/20 backdrop-blur sm:p-8">
              {error && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/15 text-3xl font-bold text-primary">
                  {initials}
                </div>
                <div className="flex-1">
                  <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
                    <UserRound className="h-4 w-4" />
                    My Profile
                  </p>
                  <h1 className="text-4xl font-bold text-white sm:text-5xl">{profile.name}</h1>
                  <p className="mt-2 text-sm font-medium text-muted">{profile.department}</p>
                  <p className="mt-1 text-sm text-muted">{profile.email}</p>
                </div>
              </div>
            </div>

            <section className="grid gap-5 lg:grid-cols-2">
              <SkillEditor
                title="Skills I Can Teach"
                input={teachInput}
                setInput={setTeachInput}
                skills={teachSkills}
                tone="cyan"
                onAdd={(event) => addSkill(event, 'teach')}
                onRemove={(skill) => removeSkill('teach', skill)}
              />
              <SkillEditor
                title="Skills I Want to Learn"
                input={learnInput}
                setInput={setLearnInput}
                skills={learnSkills}
                tone="violet"
                onAdd={(event) => addSkill(event, 'learn')}
                onRemove={(skill) => removeSkill('learn', skill)}
              />
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl shadow-slate-950/20 backdrop-blur sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">My Profile Summary</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{profile.name}</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted">
                  Live from PostgreSQL
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <ProfileSkillGroup title="Actively Teaching" skills={profile.teachSkills} tone="teach" />
                <ProfileSkillGroup title="Actively Learning" skills={profile.learnSkills} tone="learn" />
              </div>
            </section>

            <form action={formAction} onSubmit={handleSaveSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <input type="hidden" name="userId" value={profile.id} />
              {teachSkills.map((skill) => (
                <input key={`teach-${skill}`} type="hidden" name="teachSkills" value={skill} />
              ))}
              {learnSkills.map((skill) => (
                <input key={`learn-${skill}`} type="hidden" name="learnSkills" value={skill} />
              ))}
              {savedMessage && <p className="text-sm font-semibold text-emerald-500">{savedMessage}</p>}
              <button
                disabled={isSaving}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary/15 px-5 text-sm font-bold text-primary transition hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saveButtonLabel}
              </button>
            </form>
          </>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-surface p-6 text-muted shadow-2xl shadow-slate-950/20">
            Could not load your profile.
          </div>
        )}
      </section>
    </main>
  )
}

function SkillEditor({
  title,
  input,
  setInput,
  skills,
  tone,
  onAdd,
  onRemove,
}: {
  title: string
  input: string
  setInput: (value: string) => void
  skills: string[]
  tone: 'cyan' | 'violet'
  onAdd: (event: FormEvent<HTMLFormElement>) => void
  onRemove: (skill: string) => void
}) {
  const tagColor = tone === 'cyan' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary-light'

  return (
    <article className="rounded-2xl border border-white/10 bg-surface p-5 shadow-xl shadow-slate-950/20">
      <h2 className="mb-5 text-2xl font-bold text-white">{title}</h2>

      <form onSubmit={onAdd} className="mb-5 flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Add a skill"
          className="min-h-12 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-white outline-none placeholder:text-muted focus:border-primary-light"
        />
        <button
          type="submit"
          className="flex min-h-12 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/15"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span
              key={skill}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${tagColor}`}
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemove(skill)}
                className="rounded-full p-0.5 transition hover:bg-white/10"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm text-muted">No skills added yet.</span>
        )}
      </div>
    </article>
  )
}

function ProfileSkillGroup({
  title,
  skills,
  tone,
}: {
  title: string
  skills: string[]
  tone: 'teach' | 'learn'
}) {
  const pillClass =
    tone === 'teach'
      ? 'bg-primary/15 text-primary'
      : 'bg-secondary/15 text-secondary-light'

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{title}</h3>
      <div className="mt-4 flex min-h-20 flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span key={skill} className={`rounded-full px-3 py-2 text-sm font-bold ${pillClass}`}>
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-muted">No skills added yet.</p>
        )}
      </div>
    </section>
  )
}
