import { useRef } from 'react'

/**
 * Custom hook that provides a stottle function.
 * @param {number} [defaultInterval] - The initial value for the throttle interval.
 * @returns {(callback: () => void, interval?: number) => void} An executable throttle function
 * a function to executed after a certain period of time based on the last function among the functions that are executed quickly.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-throttle)
 * @example
 * ```tsx
 * const throttle = useThrottle(2000); // Initial value is 2s
 * // OR
 * const throttle = useThrottle(); // Initial value is default value (1s)
 * // Use throttle function in your component, Only one of the events that are processed redundantly can be processed.
 * ```
 */

export function useThrottle(
  defaultInterval = 1000,
): (callback: () => void, interval?: number) => void {
  const ref = useRef<ReturnType<typeof setTimeout>>()

  const throttle = (callback: () => void, interval?: number) => {
    if (ref.current !== undefined) {
      clearTimeout(ref.current)
    }

    ref.current = setTimeout(callback, interval ?? defaultInterval)
  }

  return throttle
}
