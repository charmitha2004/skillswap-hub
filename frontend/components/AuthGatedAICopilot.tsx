'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AICopilot from './AICopilot'
import { readCurrentUserFromStorage, type CurrentUser } from '../lib/currentUser'

const AUTH_CHANGE_EVENT = 'swapskill-auth-changed'

export default function AuthGatedAICopilot() {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    const syncCurrentUser = () => {
      setCurrentUser(readCurrentUserFromStorage())
    }

    syncCurrentUser()

    const handleAuthChange = () => {
      syncCurrentUser()
    }

    window.addEventListener('storage', handleAuthChange)
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    }
  }, [])

  return <AICopilot user={pathname.startsWith('/dashboard') ? currentUser : null} />
}
