import { useEffect, useRef, useState } from 'react'

import type { RefObject } from 'react'

/**A function to run in focus and blur HTML element mode */
export type UseFocusCallback = (isFocused: boolean) => void

/**
 * Custom hook that manages focus state on a DOM element.
 * @template T - The type of the DOM element. Defaults to `HTMLElement`.
 * @param {UseFocusCallback} [callback] - Optional callback function that is invoked when the element gains or loses focus.
 * @returns {[RefObject<T>, boolean]} - An array containing a ref object to attach to the HTML element and a boolean indicating if the element is focused.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-focus)
 * @example
 * ```tsx
 * const inputRef = useRef<HTMLInputElement>(null);
 * const [ref, isFocused] = useFocus((focusState) => {
 *   console.log('Focus state:', focusState);
 * });
 * // Access the ref to attach to your input element and use the isFocused variable to check the focus state.
 * <input ref={ref} type="text" placeholder="Focus me!" />
 * ```
 */
export function useFocus<T extends HTMLElement>(
  callback?: UseFocusCallback,
): [RefObject<T>, boolean] {
  const [isFocused, setIsFocused] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true)
      callback?.(true)
    }
    const handleBlur = () => {
      setIsFocused(false)
      callback?.(false)
    }

    const node = ref.current
    if (node) {
      node.addEventListener('focus', handleFocus)
      node.addEventListener('blur', handleBlur)
    }

    return () => {
      if (node) {
        node.removeEventListener('focus', handleFocus)
        node.removeEventListener('blur', handleBlur)
      }
    }
  }, [callback])

  return [ref, isFocused]
}
