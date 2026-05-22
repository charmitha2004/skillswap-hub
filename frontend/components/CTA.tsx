'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary-dark opacity-90" />
      
      {/* Animated Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
            Start Your First Skill Swap Today
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Join thousands of learners who are already exchanging skills and growing together. 
            It&apos;s free to get started!
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-white rounded-xl text-primary font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-2xl transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <p className="text-sm text-white/60 mt-6">
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  )
}
