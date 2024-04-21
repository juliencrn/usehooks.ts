import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Represents the return type of the `usePagination` hook.
 * @template T - The type of elements in the array.
 */

type UsePaginationReturnType<T> = {
  /** The elements in the current page. */
  items: T[]
  /** The total number of pages. */
  totalPages: number
  /** The current page number. */
  pageNumber: number
  /** Returns `true` if the returned page is the first. */
  isFirst: boolean
  /** Returns `true` if the returned page is the last. */
  isLast: boolean
  /** Calling `next` will move the cursor to the next page in the paginated result set and the hook will the return elements from the next page. It has no effect when the current page is the last page. */
  next: () => void
  /** Calling `previous` will move the cursor to the previous page in the paginated result set and the hook will the return elements from the previous page. It has no effect when the current page is the first page. */
  previous: () => void
  /** Calling `first` will move the cursor to the first page in the paginated result set and the hook will the return elements from the first page. It has no effect when the current page is the first page. */
  first: () => void
  /** Calling `last` will move the cursor to the last page in the paginated result set and the hook will the return elements from the last page. It has no effect when the current page is the last page. */
  last: () => void
}

type UsePaginationOptions = {
  pageSize?: number
}

const DEFAULT_PAGE_SIZE = 10

/**
 * Custom hook that paginates an input array with `next`, `previous`, `first`, and `last` functionalities.
 * @template T - The type of elements in the array.
 * @param {T[]} data - The input array.
 * @param {?UsePaginationOptions} [options] - Which has an option to set the page size, default is `10`.
 * @returns {UsePaginationReturnType<T>} - Contains the state of the paginated result set and helper functions to navigate between pages.
 * @throws An error if `pageSize <= 0` .
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-pagination)
 * @example
 * ```tsx
 * const { items, totalPages, pageNumber, isFirst, isLast, next, previous  } = usePagination([1, 2, 3, 4, 5], { pageSize: 2 });
 *
 * console.log(items, totalPages, pageNumber, isFirst, isLast); // [1, 2], 3, 1, true, false
 *
 * next()
 *
 * console.log(items, totalPages, pageNumber, isFirst, isLast); // [3, 4], 3, 2, false, false
 *
 * previous()
 *
 * console.log(items, totalPages, pageNumber, isFirst, isLast); // [1, 2], 3, 1, true, false
 *
 * ```
 */
export function usePagination<T>(
  data: T[],
  { pageSize = DEFAULT_PAGE_SIZE }: UsePaginationOptions = {},
): UsePaginationReturnType<T> {
  const [currentPageNumber, setCurrentPageNumber] = useState(0)

  const array = useMemo<T[]>(() => data || [], [data])

  const pageStartIndex = currentPageNumber * pageSize
  const pagePossibleEndIndex = (currentPageNumber + 1) * pageSize
  const pageEndIndex =
    pagePossibleEndIndex >= array.length ? array.length : pagePossibleEndIndex

  const isFirst = currentPageNumber === 0
  const isLast = pagePossibleEndIndex >= array.length

  const totalPages = array.length ? Math.ceil(array.length / pageSize) : 0
  const pageNumber = array.length ? currentPageNumber + 1 : 0

  const items = array.slice(pageStartIndex, pageEndIndex)

  const next = useCallback(() => {
    setCurrentPageNumber(current => (!isLast ? current + 1 : current))
  }, [isLast])

  const previous = useCallback(() => {
    setCurrentPageNumber(current => (!isFirst ? current - 1 : current))
  }, [isFirst])

  const first = useCallback(() => {
    setCurrentPageNumber(0)
  }, [])

  const last = useCallback(() => {
    setCurrentPageNumber(totalPages ? totalPages - 1 : 0)
  }, [totalPages])

  useEffect(() => {
    setCurrentPageNumber(0)
  }, [array, pageSize])

  if (pageSize <= 0) {
    throw Error("'pageSize' must be greater than 0")
  }

  if (!Array.isArray(data)) {
    throw Error("'data' must be an array")
  }

  return {
    items,
    totalPages,
    pageNumber,
    isFirst,
    isLast,
    next,
    previous,
    first,
    last,
  }
}
