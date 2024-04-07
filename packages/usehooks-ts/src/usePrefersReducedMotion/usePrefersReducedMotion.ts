import { useEffect, useState } from 'react'

const IS_SERVER = typeof window === 'undefined'

/**
 * A Custom hook that returns the current value of the `prefers-reduced-motion` media feature.
 * @returns {boolean | null} - The current value of the `prefers-reduced-motion` media feature. If the feature is not supported or in SSR, the value will be `null`.
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-reduced-motion)
 * @example
 * const prefersReducedMotion = usePrefersReducedMotion()
 *
 * return (
 *   <Button
 *     style={{
 *       animation: prefersReducedMotion ? 'none' : 'spin 2s linear infinite',
 *     }}
 *   />
 * )
 */
export function usePrefersReducedMotion(): boolean | null {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<
    boolean | null
  >(null)

  useEffect(() => {
    if (IS_SERVER || !window.matchMedia) return
    const query = window.matchMedia('(prefers-reduced-motion)')
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches)
    }
    handleMediaChange(query)
    query.addEventListener('change', handleMediaChange)
    return () => {
      query.removeEventListener('change', handleMediaChange)
    }
  }, [])

  return prefersReducedMotion
}
