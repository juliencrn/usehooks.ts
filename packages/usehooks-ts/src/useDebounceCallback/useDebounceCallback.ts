import { useEffect, useMemo, useRef } from 'react'

import debounce from 'lodash.debounce'

import { useUnmount } from '../useUnmount'

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
  const debouncedFunc = useRef<ReturnType<typeof debounce> | undefined>(
    undefined,
  )

  useUnmount(() => {
    if (debouncedFunc.current) {
      debouncedFunc.current.cancel()
    }
  })

  const debounced = useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options)

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args)
    }

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel()
    }

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current
    }

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush()
    }

    return wrappedFunc
  }, [func, delay, options])

  // Update the debounced function ref whenever func, wait, or options change
  useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options)
  }, [func, delay, options])

  return debounced
}
