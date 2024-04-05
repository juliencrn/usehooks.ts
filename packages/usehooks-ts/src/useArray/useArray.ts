import { useCallback, useMemo, useState } from 'react'

import type { Dispatch, SetStateAction } from 'react'

/**
 * Represents the type for the update of an element at a specific index in the array.
 */
type Update<T> = { index: number, change: T }

/** The useArray return type. */
type UseArrayReturnType<T> = {
  /** The current array state value. */
  array: Array<T>
  /** Function to set the array state directly. */
  setArray: Dispatch<SetStateAction<Array<T>>>
  /** Length of the array state value. */
  length: number
  /** Function to add one element in the array state value. */
  addOne: (element: T) => void
  /** Function to add many elements in the array state value. */
  addMany: (elements: Array<T>) => void
  /** Function to update or add one element in the array state value. */
  setOne: (element: Update<T>) => void
  /** Function to update or add many elements in the array state value. */
  setMany: (elements: Array<Update<T>>) => void
  /** Function to replace all elements in the array state value.*/
  setAll: (elements: Array<T>) => void
  /** Function to remove one element in the array state value. */
  removeOne: (index: number) => void
  /** Function to remove many elements in the array state value. */
  removeMany: (indexes: Array<number>) => void
  /** Function to remove all elements in the array state value. */
  removeAll: () => void
  /** Function to update one element in the array state value. */
  updateOne: (element: Update<T>) => void
  /** Function to update many elements in the array state value. */
  updateMany: (elements: Array<Update<T>>) => void
  /** Function to reset the array state value with the feault value. */
  reset: () => void
  /** Function to return some elements of the array state value. */
  select: (predicate?: (element: T, index: number, array: Array<T>) => unknown) => Array<T>
  /** Function to return determine if elements of the array state value are presents or not. */
  some: (predicate: (element: T, index: number, array: Array<T>) => unknown) => Boolean
}

/**
 * Custom hook that handles array state with useful utility functions.
 * @param {Array<T>} [defaultArray] - The initial value for the array state (default is `[]`).
 * @returns {UseArrayReturnType} An object containing the array state value and utility functions to manipulate the state.
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-array)
 * @example
 * ```tsx
 * const { array, setArray } = useArray<string>(['a', 'b', 'c']);
 *
 * console.log(value); // ['a', 'b', 'c']
 * ```
 */
export function useArray<T>(
  defaultArray?: Array<T>,
): UseArrayReturnType<T> {
  const [array, setArray] = useState(defaultArray || [])
  const length = useMemo(() => array.length, [array])

  const addOne = useCallback((element: T) => setArray([...array, element]), [array, setArray])

  const addMany = useCallback((elements: Array<T>) => setArray([...array, ...elements]), [array, setArray])

  const removeOne = useCallback((index: number) => setArray(array.filter((_, i) => i !== index)), [array, setArray])

  const removeMany = useCallback((indexes: Array<number>) => setArray(array.filter((_, i) => !indexes.includes(i))), [array, setArray])

  const removeAll = useCallback(() => setArray([]), [setArray])

  const updateOne = useCallback(({ index, change}: Update<T>) => setArray(array.map((e, i) => index === i ? change : e)), [array, setArray])

  const updateMany = useCallback((elements: Array<Update<T>>) => {
    const newArray = [...array]
    elements.forEach(({ index, change }) => {
      if (!!array[index]) {
        newArray[index] = change
      }
    })
    setArray(newArray)
  }, [array, setArray])

  const setOne = useCallback(({ index, change }: Update<T>) => !!array[index] ? updateOne({ index, change }) : addOne(change), [array, updateOne, addOne])

  const setMany = useCallback((elements: Array<Update<T>>) => {
    const newArray = [...array]
    elements.forEach(({ index, change }) => !!array[index] ? newArray[index] = change : newArray.push(change))
    setArray(newArray)
  }, [array, setArray])

  const setAll = useCallback((elements: Array<T>) => setArray(elements), [setArray])

  const reset = useCallback(() => setArray(defaultArray || []), [])

  const select = useCallback((predicate?: (element: T, index: number, array: Array<T>) => unknown) => !!predicate ? array.filter(predicate) : array, [array])

  const some = useCallback((predicate: (element: T, index: number, array: Array<T>) => unknown) => array.some(predicate), [array])

  return {
    array,
    length,
    setArray,
    addOne,
    addMany,
    setOne,
    setMany,
    setAll,
    removeOne,
    removeMany,
    removeAll,
    updateOne,
    updateMany,
    reset,
    select,
    some
  }
}
