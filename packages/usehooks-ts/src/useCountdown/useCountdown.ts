import { useCallback } from 'react'

import { useBoolean } from '../useBoolean'
import { useCounter } from '../useCounter'
import { useInterval } from '../useInterval'

/** The countdown's options. */
type CountdownOptions = {
  /** The countdown's starting number, initial value of the returned number. */
  countStart: number

  /**
   * The countdown's interval, in milliseconds.
   * @default 1000
   */
  intervalMs?: number
  /**
   * True if the countdown is increment.
   * @default false
   */
  isIncrement?: boolean

  /**
   * The countdown's stopping number. Pass `-Infinity` to decrease forever.
   * @default 0
   */
  countStop?: number
}

/** The countdown's controllers. */
type CountdownControllers = {
  /** Start the countdown. */
  startCountdown: () => void
  /** Stop the countdown. */
  stopCountdown: () => void
  /** Reset the countdown. */
  resetCountdown: () => void
}

/**
 * Custom hook that manages countdown.
 * @param {CountdownOptions} countdownOptions - The countdown's options.
 * @returns {[number, CountdownControllers]} An array containing the countdown's count and its controllers.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-countdown)
 * @example
 * ```tsx
 * const [counter, { startCountdown, stopCountdown, resetCountdown }] =
 *   useCountdown({useCountdown({
 *    countStart: 10,
 *    intervalMs: 1000,
 *    isIncrement: false,
 *  });
 * ```
 */
export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions): [number, CountdownControllers] {
  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
  } = useCounter(countStart)

  /*
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval.
   */
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false)

  // Will set running false and reset the seconds to initial value.
  const resetCountdown = useCallback(() => {
    stopCountdown()
    resetCounter()
  }, [stopCountdown, resetCounter])

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown()
      return
    }

    if (isIncrement) {
      increment()
    } else {
      decrement()
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown])

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null)

  return [count, { startCountdown, stopCountdown, resetCountdown }]
}
