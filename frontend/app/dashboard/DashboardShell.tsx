'use client'

import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Send,
  Sparkles,
  Trophy,
  Users,
  Video,
  X,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { saveProfileAction } from '../profile/actions'

type ActiveView =
  | 'dashboard'
  | 'people'
  | 'requests'
  | 'matches'
  | 'sessions'
  | 'profile'
  | 'reports'
  | 'leaderboard'
  | 'discussions'

type DashboardData = {
  databaseReady: boolean
  summary: {
    totalUsers: number
    activeUsers: number
    totalRequests: number
  }
  users: Array<{
    id: number
    name: string
    email: string
    role: string
    department: string
    teachSkills: string[]
    learnSkills: string[]
    updatedAt: string
  }>
  requests: Array<{
    id: number
    title: string
    description: string
    skill: string
    status: string
    senderName: string
    receiverName: string | null
    createdAt: string
  }>
  skills: Array<{
    label: string
    value: string
  }>
}

type SkillSwapUser = {
  id: number | null
  name: string
  email: string
  department: string
  teachSkills: string[]
  learnSkills: string[]
}

type CurrentUser = {
  name: string
  email: string
}

type Employee = {
  id: number
  name: string
  role: string
  department: string
  avatar: string
  offers: string[]
  seeks: string[]
}

type IncomingRequest = {
  id: number
  name: string
  avatar: string
  skill: string
  message: string
}

type OutgoingRequest = {
  id: number
  name: string
  avatar: string
  skill: string
  status: 'Pending' | 'Accepted' | 'Declined'
}

type Match = {
  id: number
  name: string
  avatar: string
  skill: string
  date: string
}

type Session = {
  id: number
  partner: string
  avatar: string
  skill: string
  date: string
  time: string
  activeStep: 0 | 1 | 2 | 3
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'people', label: 'Search' },
  { id: 'matches', label: 'Matches' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'requests', label: 'Requests' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'discussions', label: 'Discussions' },
  { id: 'reports', label: 'Reports' },
] satisfies { id: ActiveView; label: string }[]

const dashboardShortcutItems = navItems.slice(1)
const glassPanelClass = 'bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-900'
const DASHBOARD_VIEW_KEY = 'view'

const avatarFromName = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SK'

const fallbackUser = (name: string, email: string): SkillSwapUser => ({
  id: null,
  name,
  email,
  department: 'General',
  teachSkills: [],
  learnSkills: [],
})

const collectDashboardSkills = (users: DashboardData['users'], requests: DashboardData['requests']) => {
  const counts = new Map<string, number>()

  users.forEach((item) => {
    ;[...item.teachSkills, ...item.learnSkills].forEach((skill) => {
      const key = skill.trim()
      if (key) counts.set(key, (counts.get(key) || 0) + 1)
    })
  })

  requests.forEach((request) => {
    const key = request.skill.trim()
    if (key) counts.set(key, (counts.get(key) || 0) + 1)
  })

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({
      label: skill,
      value: `${count} mention${count === 1 ? '' : 's'}`,
    }))
}

export default function DashboardShell({ data }: { data: DashboardData }) {
  const router = useRouter()
  const pathname = usePathname()
  const [dashboardData, setDashboardData] = useState(data)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [user, setUser] = useState<SkillSwapUser>(
    fallbackUser(dashboardData.users[0]?.name || 'SwapSkill User', dashboardData.users[0]?.email || 'user@skillswap.dev')
  )
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState('All Skills')
  const [department, setDepartment] = useState('All Departments')
  const [requestedIds, setRequestedIds] = useState<number[]>([])
  const [requestTab, setRequestTab] = useState<'Incoming' | 'Outgoing'>('Incoming')
  const [schedulingMatch, setSchedulingMatch] = useState<Match | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [scheduledIds, setScheduledIds] = useState<number[]>([])
  const [teachInput, setTeachInput] = useState('')
  const [learnInput, setLearnInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')

  const employees = useMemo<Employee[]>(
    () =>
      dashboardData.users.map((item) => ({
        id: item.id,
        name: item.name,
        role: item.role || 'Team Member',
        department: item.department || item.role || 'General',
        avatar: avatarFromName(item.name),
        offers: item.teachSkills,
        seeks: item.learnSkills,
      })),
    [dashboardData.users]
  )

  const incoming = useMemo<IncomingRequest[]>(
    () =>
      dashboardData.requests.slice(0, 4).map((request, index) => ({
        id: request.id,
        name: request.senderName,
        avatar: avatarFromName(request.senderName),
        skill: request.skill || 'Skill swap',
        message: request.description || `Would like to swap around ${request.skill || 'this topic'}.`,
      })),
    [dashboardData.requests]
  )

  const outgoing = useMemo<OutgoingRequest[]>(
    () =>
      dashboardData.requests.slice(0, 4).map((request) => ({
        id: request.id,
        name: request.receiverName || request.senderName,
        avatar: avatarFromName(request.receiverName || request.senderName),
        skill: request.skill || 'Skill swap',
        status: request.status === 'accepted' ? 'Accepted' : request.status === 'rejected' ? 'Declined' : 'Pending',
      })),
    [dashboardData.requests]
  )

  const matches = useMemo<Match[]>(
    () =>
      employees.slice(0, 3).map((employee, index) => ({
        id: employee.id,
        name: employee.name,
        avatar: employee.avatar,
        skill: employee.offers[0] || employee.seeks[0] || 'General skill swap',
        date: ['Apr 24, 2026', 'Apr 21, 2026', 'Apr 18, 2026'][index] || 'Apr 24, 2026',
      })),
    [employees]
  )

  const sessions = useMemo<Session[]>(
    () =>
      employees.slice(0, 3).map((employee, index) => ({
        id: employee.id,
        partner: employee.name,
        avatar: employee.avatar,
        skill: employee.offers[0] || employee.seeks[0] || 'General skill swap',
        date: ['May 2, 2026', 'Today', 'Apr 26, 2026'][index] || 'Today',
        time: ['10:00 AM', '2:30 PM', '4:00 PM'][index] || '1:00 PM',
        activeStep: [1, 2, 3][index] as 1 | 2 | 3,
      })),
    [employees]
  )

  const currentUser = useMemo<CurrentUser>(() => {
    const live = employees[0]
    return {
      name: live?.name || 'SwapSkill User',
      email: live?.department ? `${live.department.toLowerCase().replace(/\s+/g, '.')}@skillswap.dev` : 'user@skillswap.dev',
    }
  }, [employees])

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = window.localStorage.getItem('swapskill_currentUser')
        if (!stored) {
          router.replace('/signin')
          return
        }

        const parsed = JSON.parse(stored) as CurrentUser & { displayName?: string; name?: string }
        const name = parsed.displayName || parsed.name || currentUser.name
        const email = parsed.email || currentUser.email
        const liveUser = dashboardData.users.find((item) => item.email.toLowerCase() === email.toLowerCase()) ||
          dashboardData.users.find((item) => item.name.toLowerCase() === name.toLowerCase())
        setUser({
          id: liveUser?.id || null,
          name: liveUser?.name || name,
          email: liveUser?.email || email,
          department: liveUser?.department || 'General',
          teachSkills: liveUser?.teachSkills || [],
          learnSkills: liveUser?.learnSkills || [],
        })
      } catch {
        router.replace('/signin')
      } finally {
        setLoadingAuth(false)
      }
    }

    syncUser()
  }, [currentUser.email, currentUser.name, dashboardData.users, router])

  const navigateToView = (view: ActiveView) => {
    setActiveView(view)
    const nextParams = new URLSearchParams(window.location.search)
    if (view === 'dashboard') {
      nextParams.delete(DASHBOARD_VIEW_KEY)
    } else {
      nextParams.set(DASHBOARD_VIEW_KEY, view)
    }
    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname
    window.history.replaceState({}, '', nextUrl)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const viewParam = params.get(DASHBOARD_VIEW_KEY)
    const validViews: ActiveView[] = ['dashboard', 'people', 'requests', 'matches', 'sessions', 'profile', 'reports', 'leaderboard', 'discussions']
    if (viewParam && validViews.includes(viewParam as ActiveView)) {
      setActiveView(viewParam as ActiveView)
    }
  }, [])

  useEffect(() => {
    if (!successMessage) return
    const timeout = window.setTimeout(() => setSuccessMessage(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [successMessage])

  const initial = useMemo(() => user.name.charAt(0).toUpperCase() || 'S', [user.name])

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const text = `${employee.name} ${employee.role} ${employee.department} ${employee.offers.join(' ')} ${employee.seeks.join(' ')}`.toLowerCase()
      const matchesQuery = text.includes(query.toLowerCase())
      const matchesSkill = skill === 'All Skills' || employee.offers.includes(skill) || employee.seeks.includes(skill)
      const matchesDepartment = department === 'All Departments' || employee.department === department
      return matchesQuery && matchesSkill && matchesDepartment
    })
  }, [department, employees, query, skill])

  const logout = () => {
    localStorage.removeItem('swapskill_currentUser')
    localStorage.removeItem('skillswap_user')
    localStorage.removeItem('skillswap_token')
    window.dispatchEvent(new Event('swapskill-auth-changed'))
    router.push('/signin')
  }

  const acceptRequest = (request: IncomingRequest) => {
    setSuccessMessage(`Accepted request from ${request.name}.`)
  }

  const addSkill = (event: FormEvent<HTMLFormElement>, type: 'teach' | 'learn') => {
    event.preventDefault()
    const value = type === 'teach' ? teachInput.trim() : learnInput.trim()
    if (!value) return
    setUser((current) => ({
      ...current,
      teachSkills:
        type === 'teach' && !current.teachSkills.includes(value)
          ? [...current.teachSkills, value]
          : current.teachSkills,
      learnSkills:
        type === 'learn' && !current.learnSkills.includes(value)
          ? [...current.learnSkills, value]
          : current.learnSkills,
    }))
    setTeachInput('')
    setLearnInput('')
    setSaved(false)
    setProfileMessage('')
  }

  const removeSkill = (type: 'teach' | 'learn', value: string) => {
    setUser((current) => ({
      ...current,
      teachSkills: type === 'teach' ? current.teachSkills.filter((skill) => skill !== value) : current.teachSkills,
      learnSkills: type === 'learn' ? current.learnSkills.filter((skill) => skill !== value) : current.learnSkills,
    }))
    setSaved(false)
    setProfileMessage('')
  }

  const saveDashboardProfile = async () => {
    if (!user.id || savingProfile) {
      setProfileMessage('Profile could not be matched to a database user.')
      return
    }

    setSavingProfile(true)
    setProfileMessage('')

    const formData = new FormData()
    formData.set('userId', String(user.id))
    user.teachSkills.forEach((skill) => formData.append('teachSkills', skill))
    user.learnSkills.forEach((skill) => formData.append('learnSkills', skill))

    try {
      const result = await saveProfileAction({ ok: false, message: '', profile: null }, formData)
      if (!result.ok || !result.profile) {
        setProfileMessage(result.message || 'Unable to save profile skills.')
        return
      }

      setUser((current) => ({
        ...current,
        name: result.profile?.name || current.name,
        email: result.profile?.email || current.email,
        department: result.profile?.department || current.department,
        teachSkills: result.profile?.teachSkills || current.teachSkills,
        learnSkills: result.profile?.learnSkills || current.learnSkills,
      }))
      setDashboardData((current) => {
        const users = current.users.map((item) =>
          item.id === result.profile?.id
            ? {
                ...item,
                name: result.profile.name,
                email: result.profile.email,
                role: result.profile.department,
                department: result.profile.department,
                teachSkills: result.profile.teachSkills,
                learnSkills: result.profile.learnSkills,
                updatedAt: new Date().toISOString(),
              }
            : item
        )

        return {
          ...current,
          users,
          skills: collectDashboardSkills(users, current.requests),
        }
      })
      router.refresh()
      setSaved(true)
      setProfileMessage('Changes saved successfully.')
    } catch {
      setProfileMessage('Unable to save profile skills.')
    } finally {
      setSavingProfile(false)
    }
  }

  if (loadingAuth) {
    return null
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <img
        src="/swapskill-logo.png"
        alt="Logo watermark"
        className="absolute left-1/2 top-1/2 z-0 h-auto w-[800px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.14] contrast-125 saturate-150"
      />

      {successMessage && (
        <div className="fixed left-1/2 top-5 z-[9999] -translate-x-1/2 rounded-lg border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary-light shadow-lg shadow-emerald-950/10">
          {successMessage}
        </div>
      )}

      {!dashboardData.databaseReady && (
        <div className="fixed bottom-5 left-1/2 z-[9999] -translate-x-1/2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 shadow-lg">
          Live database data is temporarily unavailable, so the dashboard is showing a safe fallback state.
        </div>
      )}

      <div className="relative min-h-[calc(100vh-96px)] z-10">
        <TopNav activeView={activeView} setActiveView={navigateToView} initial={initial} user={user} logout={logout} />

        <section className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
          <Header activeView={activeView} />

          {activeView === 'dashboard' && (
            <>
              <section className="mb-8 text-center">
                <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">Welcome {user.name}</h2>
              </section>

              <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Metric label="Total Requests" value={dashboardData.summary.totalRequests} />
                <Metric label="Matches Found" value={matches.length} />
                <Metric label="Active Users" value={dashboardData.summary.activeUsers} />
              </section>

              <section className="grid grid-cols-1 gap-5 xl:grid-cols-4">
                {dashboardShortcutItems.map((item) => {
                  const iconMap = {
                    Search,
                    Matches: Users,
                    Sessions: Video,
                    Requests: ClipboardList,
                    Leaderboard: Trophy,
                    Discussions: MessageSquare,
                    Reports: BarChart3,
                  } as const

                  const imageMap = {
                    Search: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
                    Matches: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                    Sessions: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b',
                    Requests: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
                    Leaderboard: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
                    Discussions: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                    Reports: 'https://images.unsplash.com/photo-1517242020758-9d18f0d96e92',
                  } as const

                  const ItemIcon = iconMap[item.label as keyof typeof iconMap]
                  const itemImage = imageMap[item.label as keyof typeof imageMap]

                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateToView(item.id)}
                      className="group relative h-48 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-lg transition duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={`${itemImage}?auto=format&fit=crop&w=1200&q=80`}
                        alt={item.label}
                        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F141E]/95 via-[#0F141E]/70 to-transparent" />
                      <div className="absolute left-6 top-6 z-20 max-w-[70%] text-left">
                        <h3 className="text-2xl font-bold text-white">{item.label}</h3>
                        <p className="mt-2 text-sm text-slate-300">Open your {item.label.toLowerCase()} workspace.</p>
                      </div>
                      <div className="absolute bottom-6 right-6 z-20 rounded-xl bg-teal-50 p-3 text-teal-600">
                        <ItemIcon className="h-6 w-6" />
                      </div>
                    </button>
                  )
                })}
              </section>
            </>
          )}

          {activeView === 'people' && (
            <SearchPanel
              query={query}
              setQuery={setQuery}
              skill={skill}
              setSkill={setSkill}
              department={department}
              setDepartment={setDepartment}
              employees={filteredEmployees}
              requestedIds={requestedIds}
              setRequestedIds={setRequestedIds}
            />
          )}

          {activeView === 'requests' && (
            <RequestsPanel
              tab={requestTab}
              setTab={setRequestTab}
              incoming={incoming}
              outgoing={outgoing}
              acceptRequest={acceptRequest}
              declineRequest={(id) => setSuccessMessage(`Declined request #${id}.`)}
            />
          )}

          {activeView === 'matches' && <MatchesPanel matches={matches} scheduledIds={scheduledIds} openMeetingModal={(match) => setSchedulingMatch(match)} />}
          {activeView === 'sessions' && <SessionsView sessions={sessions} />}
          {activeView === 'profile' && (
            <ProfilePanel
              user={user}
              initial={initial}
              teachInput={teachInput}
              setTeachInput={setTeachInput}
              learnInput={learnInput}
              setLearnInput={setLearnInput}
              addSkill={addSkill}
              removeSkill={removeSkill}
              saved={saved}
              saving={savingProfile}
              message={profileMessage}
              save={saveDashboardProfile}
            />
          )}
          {activeView === 'reports' && <ReportsView summary={dashboardData.summary} skills={dashboardData.skills} />}
          {activeView === 'leaderboard' && <LeaderboardView users={employees} />}
          {activeView === 'discussions' && <DiscussionsView requests={incoming} />}
        </section>
      </div>

      {schedulingMatch && (
        <ScheduleMeetingModal
          match={schedulingMatch}
          close={() => setSchedulingMatch(null)}
          sendInvite={() => {
            setSchedulingMatch(null)
            setSuccessMessage('Meeting invite sent successfully!')
          }}
        />
      )}
    </main>
  )
}

function TopNav({
  activeView,
  setActiveView,
  initial,
  user,
  logout,
}: {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
  initial: string
  user: SkillSwapUser
  logout: () => void
}) {
  const linkClass = (isActive: boolean) =>
    `flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-bold leading-none transition ${
      isActive ? 'bg-primary text-white shadow-lg shadow-primary-dark/30' : 'text-muted hover:bg-white/[0.05] hover:text-white'
    }`

  return (
    <nav className="sticky left-0 top-0 z-50 flex h-24 w-full items-center justify-between gap-5 border-b border-white/10 bg-[#0B131F]/90 px-4 text-white shadow-xl backdrop-blur-lg sm:px-6 lg:px-8">
      <button onClick={() => setActiveView('dashboard')} className="flex w-48 shrink-0 items-center bg-transparent text-left">
        <img src="/swapskill-logo.png" alt="SwapSkill Hub logo" className="h-20 w-auto object-contain bg-transparent" />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActiveView(item.id)} className={linkClass(activeView === item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={() => setActiveView('profile')}
          className={`flex min-w-0 items-center gap-3 rounded-full border px-3 py-2 transition sm:min-w-[210px] ${
            activeView === 'profile' ? 'border-primary-light bg-primary text-white shadow-lg shadow-primary-dark/30' : 'border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.08]'
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B131F]/60 text-sm font-bold text-primary backdrop-blur-lg">{initial}</span>
          <span className="hidden min-w-0 text-left sm:block">
            <strong className="block truncate text-sm leading-tight">{user.name}</strong>
            <span className="block truncate text-xs font-bold text-muted">{user.department}</span>
          </span>
        </button>

        <button onClick={logout} className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 text-sm font-bold text-muted transition hover:bg-white/[0.08] hover:text-white sm:px-4">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}

function Header({ activeView }: { activeView: ActiveView }) {
  const titles: Record<ActiveView, string> = {
    dashboard: 'Dashboard',
    people: 'Search',
    requests: 'Requests',
    matches: 'Matches',
    discussions: 'Community Q&A',
    sessions: 'Meeting Sessions',
    leaderboard: 'Top Mentors',
    profile: 'Profile',
    reports: 'Platform Analytics',
  }

  return (
    <div className="mb-8">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">Workspace</p>
      <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">{titles[activeView]}</h1>
    </div>
  )
}

function SearchPanel({
  query,
  setQuery,
  skill,
  setSkill,
  department,
  setDepartment,
  employees,
  requestedIds,
  setRequestedIds,
}: {
  query: string
  setQuery: (value: string) => void
  skill: string
  setSkill: (value: string) => void
  department: string
  setDepartment: (value: string) => void
  employees: Employee[]
  requestedIds: number[]
  setRequestedIds: (callback: (ids: number[]) => number[]) => void
}) {
  const skills = ['All Skills', 'React', 'SQL', 'Node.js', 'Figma', 'PostgreSQL']
  const departments = ['All Departments', 'Engineering', 'Analytics', 'Design']

  return (
    <>
      <section className={`mb-6 grid gap-3 p-4 lg:grid-cols-[1fr_220px_220px] ${glassPanelClass}`}>
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
          <Search className="h-5 w-5 text-primary" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, role, or skill" className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500" />
        </label>
        <select value={skill} onChange={(event) => setSkill(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none">
          {skills.map((item) => (
            <option key={item} className="bg-slate-50 text-slate-900">
              {item}
            </option>
          ))}
        </select>
        <select value={department} onChange={(event) => setDepartment(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none">
          {departments.map((item) => (
            <option key={item} className="bg-slate-50 text-slate-900">
              {item}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => {
          const requested = requestedIds.includes(employee.id)
          return (
            <article key={employee.id} className={`${glassPanelClass} p-5 transition hover:-translate-y-1 hover:bg-slate-100 hover:shadow-lg`}>
              <div className="mb-5 flex items-center gap-4">
                <Avatar label={employee.avatar} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
                  <p className="text-sm text-muted">
                    {employee.role} · {employee.department}
                  </p>
                </div>
              </div>
              <SkillBlock title="Offers" skills={employee.offers} tone="teach" />
              <SkillBlock title="Seeks" skills={employee.seeks} tone="learn" />
              <button onClick={() => setRequestedIds((ids) => (requested ? ids : [...ids, employee.id]))} disabled={requested} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary/15 px-4 text-sm font-bold text-primary transition hover:bg-primary/25 disabled:bg-white/10 disabled:text-muted">
                <Send className="h-4 w-4" />
                {requested ? 'Swap Requested' : 'Request Swap'}
              </button>
            </article>
          )
        })}
      </section>
    </>
  )
}

function RequestsPanel({
  tab,
  setTab,
  incoming,
  outgoing,
  acceptRequest,
  declineRequest,
}: {
  tab: 'Incoming' | 'Outgoing'
  setTab: (tab: 'Incoming' | 'Outgoing') => void
  incoming: IncomingRequest[]
  outgoing: OutgoingRequest[]
  acceptRequest: (request: IncomingRequest) => void
  declineRequest: (id: number) => void
}) {
  return (
    <>
      <div className={`mb-6 inline-flex p-1 ${glassPanelClass}`}>
        {(['Incoming', 'Outgoing'] as const).map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`min-h-11 rounded-xl px-5 text-sm font-bold transition ${tab === item ? 'bg-primary/15 text-primary' : 'text-muted hover:text-primary'}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === 'Incoming' && (
        <section className="grid gap-4">
          {incoming.length ? (
            incoming.map((request) => (
              <article key={request.id} className={`${glassPanelClass} p-5`}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <Avatar label={request.avatar} />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{request.name}</h2>
                      <p className="mt-1 text-sm text-muted">
                        Requested skill: <span className="font-bold text-primary">{request.skill}</span>
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{request.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => acceptRequest(request)} className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-light">
                      <Check className="h-4 w-4" />
                      Accept
                    </button>
                    <button onClick={() => declineRequest(request.id)} className="flex min-h-11 items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 text-sm font-bold text-red-200 hover:bg-red-500/20">
                      <X className="h-4 w-4" />
                      Decline
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState text="No incoming requests right now." />
          )}
        </section>
      )}

      {tab === 'Outgoing' && (
        <section className="grid gap-4">
          {outgoing.map((request) => (
            <article key={request.id} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${glassPanelClass}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-lg font-bold text-secondary-light">{request.avatar}</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{request.name}</h2>
                  <p className="text-sm text-muted">
                    You requested: <span className="font-bold text-primary">{request.skill}</span>
                  </p>
                </div>
              </div>
              <StatusBadge status={request.status} />
            </article>
          ))}
        </section>
      )}
    </>
  )
}

function MatchesPanel({ matches, scheduledIds, openMeetingModal }: { matches: Match[]; scheduledIds: number[]; openMeetingModal: (match: Match) => void }) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {matches.map((match) => {
        const scheduled = scheduledIds.includes(match.id)
        return (
          <article key={match.id} className={`${glassPanelClass} p-5 transition hover:-translate-y-1 hover:bg-slate-100 hover:shadow-lg`}>
            <div className="mb-5 flex items-center gap-4">
              <Avatar label={match.avatar} />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{match.name}</h2>
                <p className="text-sm text-muted">Matched on {match.date}</p>
              </div>
            </div>
            <div className={`${glassPanelClass} mb-5 p-4`}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Skill Exchange</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{match.skill}</p>
            </div>
            <button onClick={() => openMeetingModal(match)} disabled={scheduled} className="min-h-11 w-full rounded-xl bg-primary/15 px-4 text-sm font-bold text-primary hover:bg-primary/25 disabled:bg-white/10 disabled:text-muted">
              {scheduled ? 'Meeting Scheduled' : 'Schedule Meeting'}
            </button>
          </article>
        )
      })}
    </section>
  )
}

function SessionsView({ sessions }: { sessions: Session[] }) {
  return (
    <section className="grid gap-5">
      {sessions.map((session) => (
        <article key={session.id} className={`${glassPanelClass} p-5 sm:p-6`}>
          <div className="flex gap-4">
            <Avatar label={session.avatar} />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{session.partner}</h2>
              <p className="mt-1 text-sm text-muted">
                Skill session: <span className="font-bold text-primary">{session.skill}</span>
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {session.date} at {session.time}
              </p>
            </div>
          </div>

          <MeetingProgressTracker activeStep={session.activeStep} />

          <div className="mt-6 flex justify-end">
            {session.activeStep === 2 && (
              <button className="min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-light">
                Join Call
              </button>
            )}
            {session.activeStep === 3 && (
              <button className="min-h-11 rounded-xl border border-white/10 bg-[#0B131F]/60 px-5 text-sm font-bold text-primary shadow-sm backdrop-blur-lg hover:bg-white/10">
                Endorse Mentor
              </button>
            )}
            {session.activeStep < 2 && (
              <button className="min-h-11 rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-900 hover:bg-slate-200">
                Reschedule
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

function MeetingProgressTracker({ activeStep }: { activeStep: Session['activeStep'] }) {
  const steps = ['Scheduled', 'Upcoming', 'Ongoing', 'Completed']

  return (
    <div className={`mx-auto my-6 w-full max-w-[450px] px-8 py-4 ${glassPanelClass}`}>
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep
          const isActive = index === activeStep
          const nodeClass = isCompleted
            ? 'bg-primary text-white'
            : isActive
              ? 'animate-pulse bg-primary text-white shadow-lg shadow-primary/40 ring-4 ring-primary/20'
              : 'bg-white/10 text-muted'
          const lineClass = index < activeStep ? 'bg-primary' : 'bg-white/10'

          return (
            <div key={step} className="flex flex-1 items-start last:flex-none">
              <div className="flex min-w-[72px] flex-col items-center">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.8rem] font-bold transition ${nodeClass}`}>{index + 1}</div>
                <span className="mt-2 text-center text-[0.7rem] font-bold text-muted">{step}</span>
              </div>
              {index < steps.length - 1 && <div className={`mt-3 h-1 flex-1 rounded-full ${lineClass}`} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScheduleMeetingModal({ match, close, sendInvite }: { match: Match; close: () => void; sendInvite: () => void }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendInvite()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <form onSubmit={handleSubmit} className={`w-full max-w-2xl p-6 sm:p-8 ${glassPanelClass}`}>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-xl font-bold text-secondary-light">{match.avatar}</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">SCHEDULE MEETING</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">Schedule Session with {match.name}</h2>
            <p className="mt-1 text-sm font-medium text-muted">Matching for {match.skill}</p>
          </div>
        </div>

        <section className="mb-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900">Date</span>
            <input type="date" required className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900">Time</span>
            <input type="time" required className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-primary" />
          </label>
          <p className="text-sm font-medium text-muted sm:col-span-2">Times are shown in your local timezone.</p>
        </section>

        <section className="mb-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900">Meeting Type</span>
            <select defaultValue="Google Meet" className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-primary">
              <option>Google Meet</option>
              <option>Zoom</option>
              <option>Microsoft Teams</option>
              <option>In-Person</option>
            </select>
          </label>
        </section>

        <section className="mb-6">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900">Session Agenda & Goals</span>
            <textarea rows={4} placeholder="Describe what you want to focus on during this session." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500 focus:border-primary" />
          </label>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={close} className="min-h-12 rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-900 hover:bg-slate-200">
            Cancel
          </button>
          <button type="submit" className="min-h-12 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-light">
            Send Invite
          </button>
        </div>
      </form>
    </div>
  )
}

function ProfilePanel({
  user,
  initial,
  teachInput,
  setTeachInput,
  learnInput,
  setLearnInput,
  addSkill,
  removeSkill,
  saved,
  saving,
  message,
  save,
}: {
  user: SkillSwapUser
  initial: string
  teachInput: string
  setTeachInput: (value: string) => void
  learnInput: string
  setLearnInput: (value: string) => void
  addSkill: (event: FormEvent<HTMLFormElement>, type: 'teach' | 'learn') => void
  removeSkill: (type: 'teach' | 'learn', value: string) => void
  saved: boolean
  saving: boolean
  message: string
  save: () => void
}) {
  return (
    <>
      <article className={`mb-6 p-6 ${glassPanelClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 text-3xl font-bold text-primary">{initial}</div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{user.name}</h2>
            <p className="mt-1 text-muted">
              {user.email} · {user.department}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">Set up your skills so coworkers can find what you teach and match with what you want to learn.</p>
          </div>
        </div>
      </article>

      <section className="grid gap-5 lg:grid-cols-2">
        <SkillEditor title="Skills I Can Teach" input={teachInput} setInput={setTeachInput} skills={user.teachSkills} tone="teach" onAdd={(event) => addSkill(event, 'teach')} onRemove={removeSkill} />
        <SkillEditor title="Skills I Want to Learn" input={learnInput} setInput={setLearnInput} skills={user.learnSkills} tone="learn" onAdd={(event) => addSkill(event, 'learn')} onRemove={removeSkill} />
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {(saved || message) && (
          <p className={`text-sm font-semibold ${saved ? 'text-emerald-600' : 'text-amber-600'}`}>
            {message || 'Changes saved successfully.'}
          </p>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="min-h-12 rounded-xl bg-primary/15 px-5 text-sm font-bold text-primary hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
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
  tone: 'teach' | 'learn'
  onAdd: (event: FormEvent<HTMLFormElement>) => void
  onRemove: (type: 'teach' | 'learn', value: string) => void
}) {
  return (
    <article className={`${glassPanelClass} p-5`}>
      <h2 className="mb-5 text-2xl font-bold text-slate-900">{title}</h2>
      <form onSubmit={onAdd} className="mb-5 flex gap-3">
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Add a skill" className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500" />
        <button className="flex min-h-12 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-900 transition hover:bg-slate-200">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span key={skill} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${tone === 'teach' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary-light'}`}>
              {skill}
              <button onClick={() => onRemove(tone, skill)} className="rounded-full p-0.5 transition hover:bg-white/15" aria-label={`Remove ${skill}`}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm text-muted">Not added yet</span>
        )}
      </div>
    </article>
  )
}

function Avatar({ label }: { label: string }) {
  return <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">{label}</div>
}

function SkillBlock({ title, skills, tone }: { title: string; skills: string[]; tone: 'teach' | 'learn' }) {
  return (
    <div className="mb-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((item) => (
            <span key={item} className={`rounded-full px-3 py-1.5 text-xs font-bold ${tone === 'teach' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary-light'}`}>
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted">Not added yet</span>
        )}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <article className={`${glassPanelClass} p-5 transition duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-lg`}>
      <span className="text-sm font-bold text-muted">{label}</span>
      <strong className="mt-3 block text-4xl font-bold text-slate-900">{value}</strong>
    </article>
  )
}

function StatusBadge({ status }: { status: OutgoingRequest['status'] }) {
  const styles: Record<OutgoingRequest['status'], string> = {
    Pending: 'bg-amber-400/15 text-amber-200',
    Accepted: 'bg-primary/15 text-primary-light',
    Declined: 'bg-red-500/15 text-red-200',
  }
  const Icon = status === 'Accepted' ? Check : Clock3

  return (
    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-muted">{text}</div>
}

function ReportsView({ summary, skills }: { summary: DashboardData['summary']; skills: DashboardData['skills'] }) {
  const totalSessions = Math.max(summary.totalRequests * 2, 1)
  const activeMembers = summary.activeUsers
  const topSkill = skills[0]?.label || 'React'

  return (
    <>
      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`${glassPanelClass} p-6`}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted">Total Sessions</p>
          <strong className="mt-3 block text-4xl font-bold text-slate-900">{totalSessions}</strong>
        </div>
        <div className={`${glassPanelClass} p-6`}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted">Active Members</p>
          <strong className="mt-3 block text-4xl font-bold text-slate-900">{activeMembers}</strong>
        </div>
        <div className={`${glassPanelClass} p-6`}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted">Top Skill</p>
          <strong className="mt-3 block text-4xl font-bold text-slate-900">{topSkill}</strong>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${glassPanelClass} p-6`}>
          <h3 className="mb-4 text-lg font-bold text-slate-900">Sessions & Requests Trend</h3>
          <div className="h-80 w-full">
            <LineChartComponent />
          </div>
        </div>
        <div className={`${glassPanelClass} p-6`}>
          <h3 className="mb-4 text-lg font-bold text-slate-900">Top Requested Skills</h3>
          <div className="h-80 w-full">
            <BarChartComponent data={skills} />
          </div>
        </div>
      </section>
    </>
  )
}

function LineChartComponent() {
  return (
    <svg viewBox="0 0 600 300" className="h-full w-full">
      <defs>
        <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g strokeLinecap="round" strokeLinejoin="round">
        <line x1="50" y1="250" x2="550" y2="250" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      </g>
      <polyline points="50,200 130,165 210,190 290,110 370,90 450,135 550,115" fill="url(#sessionGradient)" stroke="#14B8A6" strokeWidth="2" />
      <polyline points="50,180 130,140 210,165 290,75 370,55 450,110 550,85" fill="url(#requestGradient)" stroke="#8b5cf6" strokeWidth="2" />
      <g fontSize="12" fill="#94A3B8" textAnchor="middle">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
          <text key={month} x={50 + i * 80} y="270">
            {month}
          </text>
        ))}
      </g>
      <g fontSize="11" fill="#94a3b8" textAnchor="end">
        {[0, 10, 20, 30, 40].map((num, i) => (
          <text key={num} x="45" y={250 - i * 50}>
            {num}
          </text>
        ))}
      </g>
      <g fontSize="12">
        <circle cx="50" cy="30" r="4" fill="#14B8A6" />
        <text x="65" y="35" fill="#14B8A6" fontWeight="bold">
          Sessions
        </text>
        <circle cx="200" cy="30" r="4" fill="#8b5cf6" />
        <text x="215" y="35" fill="#8b5cf6" fontWeight="bold">
          Requests
        </text>
      </g>
    </svg>
  )
}

function BarChartComponent({ data }: { data: Array<{ label: string; value: string }> }) {
  const maxCount = Math.max(data.length, 1)
  const barWidth = 50
  const spacing = 80
  const startX = 60

  return (
    <svg viewBox="0 0 600 300" className="h-full w-full">
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <line x1="50" y1="250" x2="550" y2="250" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      <line x1="50" y1="50" x2="50" y2="250" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      <g>
        {data.map((item, index) => {
          const barHeight = 80 + (index % 4) * 20
          const x = startX + index * spacing
          const y = 250 - barHeight
          return (
            <g key={item.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="10" fill="url(#barGradient)" />
              <text x={x + barWidth / 2} y="270" textAnchor="middle" fontSize="11" fill="#94A3B8">
                {item.label}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

function LeaderboardView({ users }: { users: Employee[] }) {
  const topUsers = [...users]
    .map((user) => ({
      ...user,
      score: user.offers.length * 10 + user.seeks.length * 5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  return (
    <section className="grid gap-4">
      {topUsers.map((user, index) => (
        <article key={user.id} className={`${glassPanelClass} flex items-center justify-between p-5`}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">{index + 1}</div>
            <Avatar label={user.avatar} />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-muted">{user.role}</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/15 px-3 py-1.5 text-sm font-bold text-primary">{user.score} pts</span>
        </article>
      ))}
    </section>
  )
}

function DiscussionsView({ requests }: { requests: IncomingRequest[] }) {
  return (
    <section className="grid gap-4">
      {requests.map((request) => (
        <article key={request.id} className={`${glassPanelClass} p-5`}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Community Q&A</p>
          <h2 className="text-xl font-bold text-slate-900">{request.name}</h2>
          <p className="mt-2 text-sm text-muted">{request.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">{request.skill}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Open thread</span>
          </div>
        </article>
      ))}
    </section>
  )
}

export type { DashboardData }
