'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import SplashScreen from './SplashScreen'

export default function SplashIntro() {
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    if (pathname !== '/') {
      setShowSplash(false)
      return
    }

    if (typeof window !== 'undefined' && window.sessionStorage.getItem('disableSplash')) {
      window.sessionStorage.removeItem('disableSplash')
      setShowSplash(false)
      return
    }

    setShowSplash(true)
  }, [pathname])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (pathname !== '/') {
    return null
  }

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <SplashScreen onComplete={handleSplashComplete} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
