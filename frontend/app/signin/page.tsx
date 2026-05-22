'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

type AuthMode = 'login' | 'signup' | 'forgot_password'

type FormState = {
  name: string
  email: string
  password: string
}

type AuthMessage = {
  type: 'error' | 'success'
  text: string
}

export default function SignIn() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    password: '',
  })
  const [authMessage, setAuthMessage] = useState<AuthMessage>({
    type: 'error',
    text: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBackToWebsite = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('disableSplash', '1')
    }
    router.push('/')
  }

  // Removed auto-redirect so users can visit signin page even when logged in
  // This allows them to see the form and manually navigate to dashboard if needed

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.message || 'Unable to create account')

      setAuthMessage({
        type: 'success',
        text: 'Account created successfully! Please sign in to continue.',
      })
      setAuthMode('login')
      setFormState((current) => ({
        name: '',
        email: current.email,
        password: '',
      }))
    } catch (error: any) {
      setAuthMessage({
        type: 'error',
        text: error?.message || 'An error occurred during signup. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
        }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.message || 'Unable to sign in')

      localStorage.setItem('swapskill_currentUser', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      }))
      localStorage.removeItem('skillswap_user')
      localStorage.removeItem('skillswap_token')
      window.dispatchEvent(new Event('swapskill-auth-changed'))

      setAuthMessage({
        type: 'success',
        text: 'Login successful! Redirecting...',
      })

      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setAuthMessage({
        type: 'error',
        text: error?.message || 'An error occurred during login. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      setAuthMessage({
        type: 'success',
        text: 'If an account exists, a reset link has been sent to your email.',
      })

      setTimeout(() => {
        setAuthMode('login')
        setFormState({ name: '', email: '', password: '' })
        setAuthMessage({ type: 'error', text: '' })
      }, 2000)
    } catch (error) {
      setAuthMessage({
        type: 'error',
        text: 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-white">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute left-[-10rem] top-20 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-6rem] h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      {/* Logo - Top Left Corner */}
      <div className="absolute top-6 left-6 z-20 lg:top-8 lg:left-8">
        <img src="/swapskill-logo.png" alt="SwapSkill Hub logo" className="h-14 w-auto object-contain bg-transparent lg:h-16" />
      </div>

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <button
            type="button"
            onClick={handleBackToWebsite}
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </button>

          <p className="mb-8 max-w-xl text-lg leading-8 text-muted">
            Sign in to discover people who can teach what you want to learn, and share the skills you already have.
          </p>

          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative max-w-[28rem] overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-2xl shadow-primary/20 backdrop-blur-2xl"
          >
            <img
              src="/skillswap-hero.png"
              alt="SwapSkill sign-in illustration"
              className="w-full object-contain opacity-95"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-strong mx-auto w-full max-w-md rounded-3xl p-6 shadow-2xl shadow-black/30 sm:p-8"
        >
          <button
            type="button"
            onClick={handleBackToWebsite}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-white lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Access Portal</p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              {authMode === 'login' && 'Sign in to SwapSkill'}
              {authMode === 'signup' && 'Create an Account'}
              {authMode === 'forgot_password' && 'Reset Password'}
            </h2>
          </div>

          {/* Message Display */}
          {authMessage.text && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${
                authMessage.type === 'error'
                  ? 'border-accent/25 bg-accent/10 text-accent'
                  : 'border-secondary/25 bg-secondary/10 text-secondary'
              }`}
            >
              {authMessage.text}
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form className="space-y-5" onSubmit={handleLogin}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Email</span>
                <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 focus-within:border-primary">
                  <Mail className="h-5 w-5 text-secondary" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="signin-input min-h-12 w-full bg-transparent text-white outline-none placeholder:text-muted"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Password</span>
                <span className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 focus-within:border-primary">
                  <Lock className="h-5 w-5 text-accent" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter password"
                    value={formState.password}
                    onChange={handleInputChange}
                    className="signin-input min-h-12 w-full bg-transparent pr-10 text-white outline-none placeholder:text-muted"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 accent-primary" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot_password')}
                  className="font-semibold text-secondary hover:text-white"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-light to-primary-dark font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup')
                  setFormState({ name: '', email: '', password: '' })
                  setAuthMessage({ type: 'error', text: '' })
                }}
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                <UserPlus className="h-5 w-5 text-secondary" />
                Create new account
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {authMode === 'signup' && (
            <form className="space-y-5" onSubmit={handleSignup}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Full Name</span>
                <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 focus-within:border-primary">
                  <UserPlus className="h-5 w-5 text-secondary" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className="signin-input min-h-12 w-full bg-transparent text-white outline-none placeholder:text-muted"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Email</span>
                <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 focus-within:border-primary">
                  <Mail className="h-5 w-5 text-secondary" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="signin-input min-h-12 w-full bg-transparent text-white outline-none placeholder:text-muted"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Password</span>
                <span className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 focus-within:border-primary">
                  <Lock className="h-5 w-5 text-accent" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create password"
                    value={formState.password}
                    onChange={handleInputChange}
                    className="signin-input min-h-12 w-full bg-transparent pr-10 text-white outline-none placeholder:text-muted"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-light to-primary-dark font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login')
                  setFormState({ name: '', email: '', password: '' })
                  setAuthMessage({ type: 'error', text: '' })
                }}
                className="w-full text-center text-sm font-semibold text-secondary hover:text-white"
              >
                Already have an account? Sign In
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authMode === 'forgot_password' && (
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <p className="mb-6 text-center text-sm text-muted">
                Enter your email and we will send you a reset link.
              </p>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Email</span>
                <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 focus-within:border-primary">
                  <Mail className="h-5 w-5 text-secondary" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="signin-input min-h-12 w-full bg-transparent text-white outline-none placeholder:text-muted"
                    required
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-light to-primary-dark font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login')
                  setFormState({ name: '', email: '', password: '' })
                  setAuthMessage({ type: 'error', text: '' })
                }}
                className="w-full text-center text-sm font-semibold text-secondary hover:text-white"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </main>
  )
}
