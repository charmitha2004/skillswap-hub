'use client'

import { motion } from 'framer-motion'
import { Sparkles, MessageCircle, Star, Shield, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'Our AI-powered algorithm matches you with the perfect skill partners based on your goals and expertise.',
    color: 'bg-primary/20 text-primary group-hover:bg-primary/30',
  },
  {
    icon: MessageCircle,
    title: 'Chat System',
    description: 'Built-in messaging to coordinate sessions, share resources, and stay connected with your swap partners.',
    color: 'bg-secondary/20 text-secondary-light group-hover:bg-secondary/30',
  },
  {
    icon: Star,
    title: 'Rating System',
    description: 'Transparent feedback system helps maintain quality and builds trust within the community.',
    color: 'bg-primary/20 text-primary group-hover:bg-primary/30',
  },
  {
    icon: Shield,
    title: 'Secure Profiles',
    description: 'Verified user profiles with skill credentials ensure you connect with genuine, qualified individuals.',
    color: 'bg-primary/20 text-primary group-hover:bg-primary/30',
  },
  {
    icon: Zap,
    title: 'Instant Notifications',
    description: 'Real-time alerts for new matches, messages, and session updates keep you never miss a connection.',
    color: 'bg-secondary/20 text-secondary-light group-hover:bg-secondary/30',
  },
  {
    icon: Users,
    title: 'Community Events',
    description: 'Participate in workshops, hackathons, and skill-sharing events to expand your network.',
    color: 'bg-secondary/20 text-secondary-light group-hover:bg-secondary/30',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-background-light/30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mt-3 mb-4">
            Powerful Features
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Everything you need to maximize your skill exchange experience
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="p-6 rounded-2xl glass hover:bg-white/5 transition-all duration-300 h-full border border-transparent hover:border-white/10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 transition-colors`}>
                  <feature.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
