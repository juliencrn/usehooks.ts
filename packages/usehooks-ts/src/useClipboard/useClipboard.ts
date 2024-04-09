import { useState } from 'react'

export function useClipboard({ timeout = 2000 }: { timeout?: number }) {
  const [isCopied, setIsCopied] = useState<Boolean>(false)

  const copyToClipboard = (value: string) => {
    if (!value) return
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) return

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyToClipboard }
}
