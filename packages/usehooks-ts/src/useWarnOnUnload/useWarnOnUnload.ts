import { useEffect } from 'react'

type UseWarnOnUnloadProps = {
  hasWarn: boolean
}

export const useWarnOnUnload = ({ hasWarn }: UseWarnOnUnloadProps) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasWarn) return
      event.preventDefault()
    }

    if (hasWarn) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasWarn])
}
