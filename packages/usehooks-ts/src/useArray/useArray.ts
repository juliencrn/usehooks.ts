import { useState } from 'react'

/**  This defines the return type of the custom hook `useArray`. */
type UseArrayReturnType<T> = {
  /** An array containing elements of type T.  */
  value: T[]
  /** A function that adds an element of type T to the array.  */
  push: (element: T) => void
  /** A function that removes an element from the array by its index.  */
  removeByIndex: (index: number) => void
}

/**
 * Custom hook that handles Array state with useful utility functions.
 * @param {[]} [initialValue] - The initial value for the Array state (default is `[]`).
 * @returns {UseArrayReturnType} An object containing the utility functions to manipulate the state.
 * @throws Will throw an error if `initialValue` is an invalid array value.
 * @public
 * @see Yet..
 * @example
 * ```tsx
 * const { value, push, removeByIndex } = useArray<number>([1, 2, 3]);
 * ```
 */

export function useArray<T>(initialValue: T[]): UseArrayReturnType<T> {
  const [array, setArray] = useState<T[]>(initialValue)

  const push = (element: T) => {
    setArray(prevArray => [...prevArray, element])
  }

  const removeByIndex = (index: number) => {
    setArray(prevArray => prevArray.filter((_, i) => i !== index))
  }

  return { value: array, push, removeByIndex }
}
