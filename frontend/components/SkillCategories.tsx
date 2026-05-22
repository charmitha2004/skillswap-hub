'use client'

import { motion } from 'framer-motion'
import { Code, Palette, Languages, Music, TrendingUp } from 'lucide-react'

const categories = [
  {
    icon: Code,
    name: 'Coding',
    description: 'Python, JavaScript, React, and more',
    color: 'from-primary-light to-primary-dark',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Palette,
    name: 'Design',
    description: 'UI/UX, Graphic Design, Figma',
    color: 'from-secondary-light to-secondary-dark',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Languages,
    name: 'Language',
    description: 'English, Spanish, French, Mandarin',
    color: 'from-primary to-secondary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Music,
    name: 'Music',
    description: 'Guitar, Piano, Music Theory',
    color: 'from-secondary-light to-secondary-dark',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: TrendingUp,
    name: 'Marketing',
    description: 'SEO, Social Media, Content Strategy',
    color: 'from-secondary-light to-primary',
    bgColor: 'bg-secondary/10',
  },
]

export default function SkillCategories() {
  return (
    <section id="skills" className="py-24 relative">
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
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Explore
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mt-3 mb-4">
            Skill Categories
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Discover skills across various domains and find your perfect match
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className={`p-6 rounded-2xl ${category.bgColor} border border-white/5 hover:border-white/20 transition-all duration-300 h-full`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                <p className="text-sm text-muted">
                  {category.description}
                </p>

                {/* Hover Gradient Line */}
                <div className={`h-1 mt-4 rounded-full bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 glass rounded-xl text-white font-medium hover:bg-white/10 transition-all"
          >
            View All Categories
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
