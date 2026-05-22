export type CurrentUser = {
  displayName: string
  email: string
}

const CURRENT_USER_STORAGE_KEY = 'swapskill_currentUser'

export function readCurrentUserFromStorage(): CurrentUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedValue = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    if (!storedValue) {
      return null
    }

    const parsed = JSON.parse(storedValue) as {
      name?: string
      displayName?: string
      email?: string
    }

    const displayName = parsed.displayName || parsed.name || ''
    const email = parsed.email || ''

    if (!displayName || !email) {
      return null
    }

    return { displayName, email }
  } catch {
    return null
  }
}

