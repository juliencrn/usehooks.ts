import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * The return type of the useTimeout hook.
 */
type UseTimeoutReturn = {
  /** A boolean indicating if timeout is currently running. */
  isRunning: boolean
  /** A boolean indicating if timeout is currently paused. */
  isPaused: boolean
  /** A boolean indicating if timeout is currently stopped or finished. */
  isStopped: boolean
  /** Function to start the timeout. */
  start: () => void
  /** Function to pause a running timeout. */
  pause: () => void
  /** Function to stop a running timeout. */
  stop: () => void
  /** Function to reset a running or stopped timeout. */
  reset: () => void
}

/**
 * Custom hook that handles timeouts in React components using the [`setTimeout API`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).
 * @param {() => void} callback - The function to be executed when the timeout elapses.
 * @param {number | null} delay - The duration (in milliseconds) for the timeout. Set to `null` to clear the timeout.
 * @returns {UseTimeoutReturn} An object containing the timeout state and utility functions to pause, stop, start or reset the timeout.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-timeout)
 * @example
 * ```tsx
 * // Usage of useTimeout hook
 * useTimeout(() => {
 *   // Code to be executed after the specified delay
 * }, 1000); // Set a timeout of 1000 milliseconds (1 second)
 * ```
 */
export function useTimeout(
  callback: () => void,
  delay: number | null,
): UseTimeoutReturn {
  const savedCallback = useRef(callback)
  const internalDelayRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // There are two timestamp states:
  // processStartTime - kicks off the render which will schedule the timeout
  // actualStartTime - more accurate timeout start time as it's set in the same render phase as timeout
  const [processStartTime, setProcessStartTime] = useState<number | null>(null)
  const [actualStartTime, setActualStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)

  const cleanUp = useCallback((fullCleanUp?: boolean) => {
    if (timeoutRef.current) {
      // Clear timeout
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined

      // Reset both timestamps
      setProcessStartTime(null)
      setActualStartTime(null)
    }

    // Clear elapsed time for a full clean up
    if (fullCleanUp) setTimeElapsed(0)
  }, [])

  const start = useCallback(() => {
    const currentDelay = internalDelayRef.current
    // Don't run if no delay is specified or a timeout is already running
    // Note: 0 is a valid value for delay
    if (timeoutRef.current ?? (!currentDelay && currentDelay !== 0)) return

    setProcessStartTime(Date.now())
  }, [])

  const pause = useCallback(() => {
    if (!timeoutRef.current || !actualStartTime) return

    // Save the amount of time that has elapsed since the timeout started
    setTimeElapsed(prev => prev + Date.now() - actualStartTime)
    // Soft clean up to keep elapsed time
    cleanUp()
  }, [actualStartTime, cleanUp])

  const stop = useCallback(() => {
    cleanUp(true)
  }, [cleanUp])

  const reset = useCallback(() => {
    stop()
    start()
  }, [stop, start])

  // Remember the latest callback if it changes
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Update internal delay ref and reset the timeout when delay prop changes
  useEffect(() => {
    if (internalDelayRef.current !== delay) {
      internalDelayRef.current = delay
      reset()
    }
  }, [delay, reset])

  useEffect(() => {
    // Don't schedule if there's no start time or delay is not specified
    if (!processStartTime || internalDelayRef.current === null) return

    // Set up the timeout
    timeoutRef.current = setTimeout(() => {
      savedCallback.current()
      // Clean everything up after callback is called
      cleanUp(true)
    }, internalDelayRef.current - timeElapsed)

    setActualStartTime(Date.now())

    return cleanUp
  }, [processStartTime, timeElapsed, cleanUp])

  return {
    isRunning: !!timeoutRef.current,
    isPaused: !timeoutRef.current && !!timeElapsed,
    isStopped: !timeoutRef.current && !timeElapsed,
    start,
    pause,
    stop,
    reset,
  }
}
