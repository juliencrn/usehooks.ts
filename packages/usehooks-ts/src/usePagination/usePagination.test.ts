import { act, renderHook } from '@testing-library/react'

import { usePagination } from './usePagination'

describe('usePagination()', () => {
  it('should use pagination be ok', () => {
    const { result } = renderHook(() =>
      usePagination([1, 2, 3, 4, 5], { pageSize: 2 }),
    )
    const { items, totalPages, pageNumber, isFirst, isLast } = result.current

    expect(items).toStrictEqual([1, 2])
    expect(totalPages).toBe(3)
    expect(pageNumber).toBe(1)
    expect(isFirst).toBe(true)
    expect(isLast).toBe(false)
  })

  it('should return correct results for the next page', () => {
    const data = [1, 2, 3, 4, 5]
    const { result } = renderHook(() => usePagination(data, { pageSize: 2 }))

    const { next } = result.current

    act(next)

    const { items, totalPages, pageNumber, isFirst, isLast } = result.current

    expect(items).toStrictEqual([3, 4])
    expect(totalPages).toBe(3)
    expect(pageNumber).toBe(2)
    expect(isFirst).toBe(false)
    expect(isLast).toBe(false)
  })

  it('should return correct results for the final page', () => {
    const data = [1, 2, 3, 4, 5]
    const { result } = renderHook(() => usePagination(data, { pageSize: 2 }))

    const { next } = result.current

    // goto the second page
    act(next)
    // goto the third page
    act(next)

    const { items, totalPages, pageNumber, isFirst, isLast } = result.current

    expect(items).toStrictEqual([5])
    expect(totalPages).toBe(3)
    expect(pageNumber).toBe(3)
    expect(isFirst).toBe(false)
    expect(isLast).toBe(true)
  })

  it('should return correct results for items <= pageSize', () => {
    const data = [1]
    const { result } = renderHook(() => usePagination(data, { pageSize: 2 }))

    const { items, totalPages, pageNumber, isFirst, isLast } = result.current

    expect(items).toStrictEqual([1])
    expect(totalPages).toBe(1)
    expect(pageNumber).toBe(1)
    expect(isFirst).toBe(true)
    expect(isLast).toBe(true)
  })

  it('should return first and last pages', () => {
    const data = [1, 2, 3, 4, 5]
    const { result } = renderHook(() => usePagination(data, { pageSize: 2 }))

    expect(result.current.totalPages).toBe(3)
    expect(result.current.pageNumber).toBe(1)

    act(result.current.last)

    expect(result.current.pageNumber).toBe(3)

    act(result.current.first)

    expect(result.current.pageNumber).toBe(1)
  })

  it("should execute 'first' and 'last' correctly when data is empty", () => {
    const { result } = renderHook(() => usePagination([]))

    expect(result.current.totalPages).toBe(0)
    expect(result.current.pageNumber).toBe(0)

    act(result.current.last)

    expect(result.current.pageNumber).toBe(0)

    act(result.current.first)

    expect(result.current.pageNumber).toBe(0)
  })

  it('should return correct results when data is empty', () => {
    const { result } = renderHook(() => usePagination([]))

    const { items, totalPages, pageNumber, isFirst, isLast } = result.current

    expect(items).toStrictEqual([])
    expect(totalPages).toBe(0)
    expect(pageNumber).toBe(0)
    expect(isFirst).toBe(true)
    expect(isLast).toBe(true)
  })

  it('should reset the pagination details when data changes', () => {
    const defaultData = [1, 2, 3, 4, 5]
    const { result, rerender } = renderHook((data: number[] = defaultData) =>
      usePagination(data, { pageSize: 2 }),
    )

    const { next } = result.current

    act(next)
    act(next)

    expect(result.current.items).toStrictEqual([5])

    const newData = [1, 2, 3, 4, 5, 6, 7]
    rerender(newData)

    expect(result.current.totalPages).toBe(4)
    expect(result.current.items).toStrictEqual([1, 2])
  })

  describe('should throw an error', () => {
    test('when pageSize === 0', () => {
      const data = [1, 2, 3, 4, 5]
      expect(() => {
        renderHook(() => usePagination(data, { pageSize: 0 }))
      }).toThrow("'pageSize' must be greater than 0")
    })

    test('when data is not an array', () => {
      const data: number[] | null = null

      expect(() => {
        renderHook(() => usePagination(data as unknown as number[]))
      }).toThrow("'data' must be an array")
    })
  })
})
