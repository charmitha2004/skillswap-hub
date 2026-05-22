'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LogOut, Menu, UserRound, X } from 'lucide-react'

type SessionUser = {
  name: string
  email: string
}

const appLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Search', href: '/search' },
  { name: 'Matches', href: '/matches' },
  { name: 'Sessions', href: '/sessions' },
  { name: 'Requests', href: '/requests' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Discussions', href: '/discussions' },
  { name: 'Reports', href: '/reports' },
]

const marketingLinks = [
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Skills', href: '#skills' },
  { name: 'Features', href: '#features' },
  { name: 'Testimonials', href: '#testimonials' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)

  const isMarketingPage = pathname === '/'
  const navLinks = isMarketingPage ? marketingLinks : appLinks

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let active = true

    fetch('/api/auth/me', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data?.user) setUser(data.user)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [pathname])

  const initials = useMemo(() => {
    const name = user?.name?.trim()
    if (!name) return 'U'
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [user?.name])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
    } finally {
      localStorage.removeItem('swapskill_currentUser')
      localStorage.removeItem('skillswap_user')
      localStorage.removeItem('skillswap_token')
      window.dispatchEvent(new Event('swapskill-auth-changed'))
      setUser(null)
      setIsProfileOpen(false)
      setIsMobileMenuOpen(false)
      window.location.assign('/signin')
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled || !isMarketingPage
          ? 'border-b border-white/10 bg-slate-900/95 py-3 shadow-xl shadow-slate-950/20 backdrop-blur-xl'
          : 'border-b border-white/10 bg-slate-900/90 py-5 shadow-lg shadow-slate-950/10 backdrop-blur-xl'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center">
            <img src="/swapskill-logo.png" alt="SwapSkill Hub logo" className="h-10 w-auto bg-transparent object-contain" />
          </Link>

          <div className="hidden items-center gap-2 xl:flex">
            {navLinks.map((link) => {
              const active = !isMarketingPage && pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active ? 'bg-primary/15 text-primary' : 'text-muted hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-xs text-primary">{initials}</span>
                  <span>{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/40"
                    >
                      <div className="border-b border-white/10 p-4">
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="mt-1 truncate text-xs text-muted">{user.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-muted hover:bg-white/10 hover:text-white">
                        <UserRound className="h-4 w-4" />
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-red-200 hover:bg-red-500/10">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/signin" className="rounded-lg bg-gradient-to-r from-primary-light to-primary-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-primary/30">
                Sign In
              </Link>
            )}
          </div>

          <button
            className="text-white xl:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl glass-strong xl:hidden"
          >
            <div className="space-y-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-3">
                {user ? (
                  <>
                    <Link href="/profile" className="block rounded-xl px-3 py-2 text-sm font-semibold text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      {user.name}
                    </Link>
                    <button onClick={handleLogout} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-200">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/signin" className="block rounded-xl bg-primary/15 px-3 py-3 text-center text-sm font-bold text-primary">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
