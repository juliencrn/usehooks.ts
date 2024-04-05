import { useRef, useState } from 'react'

import { useDebounceCallback } from '../useDebounceCallback'
import { useEventListener } from '../useEventListener'
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'

/**
 * Represent the dimension of the window.
 * @template T - The type of the dimension (number or undefined).
 */
type WindowSize<T extends number | undefined = number | undefined> = {
  /** The width of the window. */
  width: T
  /** The height of the window. */
  height: T
}

/**
 * Hook options.
 * @template InitializeWithValue - If `true` (default), the hook will initialize reading the window size. In SSR, you should set it to `false`, returning `undefined` initially.
 */
type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
  /**
   * If `true` (default), the hook will initialize reading the window size. In SSR, you should set it to `false`, returning `undefined` initially.
   * @default true
   */
  initializeWithValue: InitializeWithValue
  /**
   * The delay in milliseconds before the state is updated (disabled by default for retro-compatibility).
   * @default undefined
   */
  debounceDelay?: number
}

const IS_SERVER = typeof window === 'undefined'

// SSR version of useWindowSize.
export function useWindowSize(options: UseWindowSizeOptions<false>): WindowSize
// CSR version of useWindowSize.
export function useWindowSize(
  options?: Partial<UseWindowSizeOptions<true>>,
): WindowSize<number>
/**
 * Custom hook that tracks the size of the window.
 * @param {?UseWindowSizeOptions} [options] - The options for customizing the behavior of the hook (optional).
 * @returns {object} An object containing the width and height of the window.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-window-size)
 * @example
 * ```tsx
 * const { width = 0, height = 0 } = useWindowSize();
 * console.log(`Window size: ${width} x ${height}`);
 * ```
 */
export function useWindowSize(
  options: Partial<UseWindowSizeOptions<boolean>> = {},
): WindowSize | WindowSize<number> {
  let { initializeWithValue = true } = options
  if (IS_SERVER) {
    initializeWithValue = false
  }

  const screenOrientationRef = useRef(
    !IS_SERVER ? window.screen.orientation : null,
  )

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (initializeWithValue) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }
    return {
      width: undefined,
      height: undefined,
    }
  })

  const debouncedSetWindowSize = useDebounceCallback(
    setWindowSize,
    options.debounceDelay,
  )

  function handleSize() {
    const { innerWidth, innerHeight } = window

    // Only update the state if width or height actually changed
    if (innerWidth !== windowSize.width || innerHeight !== windowSize.height) {
      const setSize = options.debounceDelay
        ? debouncedSetWindowSize
        : setWindowSize

      setSize({
        width: innerWidth,
        height: innerHeight,
      })
    }
  }

  useEventListener('resize', handleSize)
  useEventListener('change', handleSize, screenOrientationRef)

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize()
  }, [])

  return windowSize
}
