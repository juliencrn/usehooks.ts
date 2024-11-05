import { useEffect, useState } from 'react'

/** Hook return type. */
type UseNetworkStatusReturnType = {
  /** The current user network status. */
  isOnline: boolean
}

const IS_SERVER = typeof window === 'undefined'

/**
 * Custom hook to tracks the user's network status.
 * @returns {UseNetworkStatusReturnType} A boolean value that represents the user's network status (online/offline).
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-network-status)
 * @example
 * ```tsx
 * const { isOnline } = useNetworkStatus();
 *
 * console.log(isOnline); // true/false
 * ```
 */
export function useNetworkStatus(): UseNetworkStatusReturnType {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (IS_SERVER) {
      return true
    }
    return window.navigator.onLine
  })

  useEffect(() => {
    if (IS_SERVER) {
      return
    }

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return {
    isOnline,
  }
}
