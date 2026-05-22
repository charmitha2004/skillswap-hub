'use client'

import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const stats = [
    { value: '10K+', label: 'Active learners' },
    { value: '500+', label: 'Skills available' },
    { value: '50K+', label: 'Skills swapped' },
    { value: '25+', label: 'Countries reached' },
  ]

  return (
    <section className="relative overflow-hidden pt-28">
      <div className="absolute inset-0 -z-20 animated-gradient" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 text-center sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:text-left">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm text-muted">Join 10,000+ learners worldwide</span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            Swap Skills,{' '}
            <span className="gradient-text">Grow Together</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted sm:text-xl lg:mx-0">
            Learn anything by teaching what you know. Connect with skilled individuals,
            exchange knowledge, and level up your abilities.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <button
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-light to-primary-dark px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-xl hover:shadow-primary/30"
              onClick={() => { window.location.href = '/signin' }}
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#skills"
              className="rounded-xl glass px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              Explore Skills
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <img
            src="/skillswap-hero.png"
            alt="Illustration of people exchanging teaching and learning skills"
            className="relative h-full w-full rounded-3xl object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 border-y border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-4 lg:px-8 lg:py-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-2 text-center ${
                index > 0 ? 'lg:border-l lg:border-white/10' : ''
              } ${index % 2 === 1 ? 'border-l border-white/10 lg:border-l' : ''}`}
            >
              <div className="font-display text-2xl font-bold tracking-normal text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted sm:text-[0.68rem]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
