'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Learn: Python | Teach: Design',
    avatar: 'SC',
    rating: 5,
    feedback: 'SwapSkill Hub changed how I learn! I taught UI design while learning Python, and the experience was incredible. Found a mentor who actually cares about my growth.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Learn: Guitar | Teach: Marketing',
    avatar: 'MJ',
    rating: 5,
    feedback: 'As a marketing professional, I wanted to learn music for years. Found an amazing guitar teacher through SwapSkill Hub. The swap system is brilliant!',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Learn: French | Teach: Coding',
    avatar: 'ER',
    rating: 5,
    feedback: "The matching algorithm is spot on! Connected with a French native who needed help with React. We've been swapping for 3 months now.",
  },
  {
    name: 'David Kim',
    role: 'Learn: Photography | Teach: Japanese',
    avatar: 'DK',
    rating: 5,
    feedback: 'Best decision I made this year. Taught Japanese to professionals while learning photography from a pro. The community is so supportive!',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mt-3 mb-4">
            What Users Say
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Hear from our community of skill swappers
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="p-8 rounded-2xl glass hover:bg-white/5 transition-all duration-300 h-full border border-transparent hover:border-white/10">
                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                
                {/* Feedback */}
                <p className="text-muted leading-relaxed mb-6">
                  "{testimonial.feedback}"
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
