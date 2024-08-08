import { useMemo, useRef } from 'react'

import debounce from 'lodash.debounce'

/** Configuration options for controlling the behavior of the debounced function. */
type DebounceOptions = {
  /**
   * Determines whether the function should be invoked on the leading edge of the timeout.
   * @default false
   */
  leading?: boolean
  /**
   * Determines whether the function should be invoked on the trailing edge of the timeout.
   * @default false
   */
  trailing?: boolean
  /**
   * The maximum time the specified function is allowed to be delayed before it is invoked.
   */
  maxWait?: number
}

/** Functions to manage a debounced callback. */
type ControlFunctions = {
  /** Cancels pending function invocations. */
  cancel: () => void
  /** Immediately invokes pending function invocations. */
  flush: () => void
  /**
   * Checks if there are any pending function invocations.
   * @returns `true` if there are pending invocations, otherwise `false`.
   */
  isPending: () => boolean
}

/**
 * Represents the state and control functions of a debounced callback.
 * Subsequent calls to the debounced function return the result of the last invocation.
 * Note: If there are no previous invocations, the result will be undefined.
 * Ensure proper handling in your code.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions

/**
 * Custom hook that creates a debounced version of a callback function.
 * @template T - Type of the original callback function.
 * @param {T} func - The callback function to be debounced.
 * @param {number} delay - The delay in milliseconds before the callback is invoked (default is `500` milliseconds).
 * @param {DebounceOptions} [options] - Options to control the behavior of the debounced function.
 * @returns {DebouncedState<T>} A debounced version of the original callback along with control functions.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-debounce-callback)
 * @example
 * ```tsx
 * const debouncedCallback = useDebounceCallback(
 *   (searchTerm) => {
 *     // Perform search after user stops typing for 500 milliseconds
 *     searchApi(searchTerm);
 *   },
 *   500
 * );
 *
 * // Later in the component
 * debouncedCallback('react hooks'); // Will invoke the callback after 500 milliseconds of inactivity.
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions,
): DebouncedState<T> {
  const isPendingRef = useRef(false)

  return useMemo(() => {
    const debouncedFunc = debounce(
      (...args: Parameters<T>) => {
        try {
          return func(...args)
        } finally {
          // Whenever execution of the debounced function has finished, it's execution is not pending anymore,
          // even in case of errors.
          isPendingRef.current = false
        }
      },
      delay,
      options,
    )

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      // This code will be executed whenever the client/caller invokes the debounced method,
      // so now is the right time to set isPending to true.
      isPendingRef.current = true
      return debouncedFunc(...args)
    }

    wrappedFunc.cancel = () => {
      isPendingRef.current = false
      debouncedFunc.cancel()
    }

    wrappedFunc.isPending = () => {
      return isPendingRef.current
    }

    wrappedFunc.flush = () => {
      isPendingRef.current = false
      return debouncedFunc.flush()
    }

    return wrappedFunc
  }, [func, delay, options])
}
