import { useIsMounted } from '../useIsMounted'
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'
import { useLocalStorage } from '../useLocalStorage'
import { useMediaQuery } from '../useMediaQuery'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'
const LOCAL_STORAGE_KEY = 'usehooks-ts-dark-mode'

/** The hook options. */
type DarkModeOptions = {
  /**
   * The initial value of the dark mode.
   * @default false
   */
  defaultValue?: boolean
  /**
   * The key to use in the local storage.
   * @default 'usehooks-ts-dark-mode'
   */
  localStorageKey?: string
  /**
   * If `true` (default), the hook will initialize reading `localStorage`.
   * In SSR, you should set it to `false`, returning the `defaultValue` or `false` initially.
   * @default true
   */
  initializeWithValue?: boolean
}

/** The hook return type. */
type DarkModeReturn = {
  /** The current state of the dark mode. */
  isDarkMode: boolean
  /** Function to toggle the dark mode. */
  toggle: () => void
  /** Function to enable the dark mode. */
  enable: () => void
  /** Function to disable the dark mode. */
  disable: () => void
  /** Function to set a specific value to the dark mode. */
  set: (value: boolean) => void
}

/**
 * Custom hook that returns the current state of the dark mode.
 * @param {?DarkModeOptions} [options] - The initial value of the dark mode, default `false`.
 * @returns {DarkModeReturn} An object containing the dark mode's state and its controllers.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-dark-mode)
 * @example
 * ```tsx
 * const { isDarkMode, toggle, enable, disable, set } = useDarkMode({ defaultValue: true });
 * ```
 */
export function useDarkMode(options: DarkModeOptions = {}): DarkModeReturn {
  const {
    defaultValue,
    localStorageKey = LOCAL_STORAGE_KEY,
    initializeWithValue = true,
  } = options

  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, {
    initializeWithValue,
    defaultValue,
  })
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(
    localStorageKey,
    defaultValue ?? isDarkOS ?? false,
    { initializeWithValue },
  )

  // Update darkMode if os prefers changes
  const allowDarkOSChange = useIsMounted()
  useIsomorphicLayoutEffect(() => {
    if (allowDarkOSChange() && isDarkOS !== isDarkMode) {
      setDarkMode(isDarkOS)
    }
  }, [isDarkOS])

  return {
    isDarkMode,
    toggle: () => {
      setDarkMode(prev => !prev)
    },
    enable: () => {
      setDarkMode(true)
    },
    disable: () => {
      setDarkMode(false)
    },
    set: value => {
      setDarkMode(value)
    },
  }
}
