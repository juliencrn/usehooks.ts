import { useState } from 'react'

import jsCookie from 'js-cookie'

import { useEventCallback } from '../useEventCallback'
import { isFunction, isString } from '../utils'

export type State = string | undefined
export type Option = {
  defaultValue?: State | (() => State)
} & Cookies.CookieAttributes
export type UseCookieOuput = [
  cookieValue: State,
  updateCookie: (
    newVal: State | ((prev: State) => State),
    newOption?: Cookies.CookieAttributes,
  ) => void,
  deleteCookie: () => void,
]

/**
 * Custom hook that manages cookie state in React components.
 * @param {State} cookieKey - The key under which the value will be stored in Cookie.
 * @param {Option?} options - Options of `js-cookie`.
 * @returns {UseCookieOuput} - A tuple containing the state value of Cookie, the `updateCookie` function and the `deleteCookie` function.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-cookie)
 * @example
 * ```tsx
 * const [cookieValue, updateCookie, deleteCookie] = useCookie('testKey'); // no default value
 * // OR
 * const [cookieValue, updateCookie, deleteCookie] = useToggle('testKey1', { defaultValue: 'testValue' }); // setting defaultVal of options
 * updateCookie('testStrValue'); // cookieValue is 'testStrValue'
 * deleteCookie() // cookieValue is undefined
 * ```
 */
export function useCookie(
  cookieKey: string,
  options: Option = {},
): UseCookieOuput {
  const [cookieValue, setCookieValue] = useState(() => {
    const cookieVal = jsCookie.get(cookieKey)

    if (isString(cookieVal)) return cookieVal

    if (isFunction(options.defaultValue)) {
      return options.defaultValue()
    }

    return options.defaultValue
  })

  const updateCookie = useEventCallback(
    (
      newVal: State | ((prev: State) => State),
      newOptions: Cookies.CookieAttributes = {},
    ) => {
      const { defaultValue, ...restOptions } = { ...options, ...newOptions }
      const value = isFunction(newVal) ? newVal(cookieValue) : newVal

      setCookieValue(value)

      // if it exists, clear it first
      if (value === undefined) {
        jsCookie.remove(cookieKey)
      } else {
        jsCookie.set(cookieKey, value, restOptions)
      }
    },
  )

  const deleteCookie = useEventCallback(() => {
    jsCookie.remove(cookieKey)
    setCookieValue(undefined)
  })

  return [cookieValue, updateCookie, deleteCookie]
}
