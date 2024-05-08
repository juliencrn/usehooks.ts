import { act, renderHook } from '@testing-library/react'

import { useArray } from './useArray'

describe('useArray hook', () => {
  it('should initialize with the provided initial value', () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    expect(result.current.value).toEqual([1, 2, 3])
  })

  it('should add an element to the array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    act(() => {
      result.current.push(4)
    })
    expect(result.current.value).toEqual([1, 2, 3, 4])
  })

  it('should remove an element from the array by index', () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    act(() => {
      result.current.removeByIndex(1)
    })
    expect(result.current.value).toEqual([1, 3])
  })
})
