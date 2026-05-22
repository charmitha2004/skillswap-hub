'use client'

import { motion } from 'framer-motion'
import { UserPlus, BookOpen, ArrowRightLeft } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Profile',
    description: 'Sign up and build your profile. Showcase your expertise and list the skills you can teach others.',
    color: 'from-primary-light to-primary-dark',
  },
  {
    icon: BookOpen,
    title: 'Add Skills',
    description: 'Browse through hundreds of skills. Add the skills you want to learn to your wishlist.',
    color: 'from-secondary-light to-secondary-dark',
  },
  {
    icon: ArrowRightLeft,
    title: 'Start Swapping',
    description: 'Connect with compatible learners. Schedule sessions and exchange knowledge seamlessly.',
    color: 'from-primary-light to-secondary',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-background-light/50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </motion.div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              {/* Card */}
              <div className="p-8 rounded-2xl glass-strong h-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow Connector (hidden on last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                    <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
