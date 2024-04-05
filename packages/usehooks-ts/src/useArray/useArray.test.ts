import { act, renderHook } from '@testing-library/react'

import { useArray } from './useArray'

describe('useArray()', () => {
  it('should use the default array', () => {
    const { result } = renderHook(() => useArray())
    const { array, length } = result.current

    expect(array).toStrictEqual([])
    expect(length).toBe(0)
  })

  it('should use the given array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))
    const { array, length } = result.current

    expect(array).toStrictEqual(['a', 'b', 'c'])
    expect(length).toBe(3)
  })

  it('should add one element in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.addOne('d')
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c', 'd'])
    expect(result.current.length).toBe(4)
  })

  it('should add many elements in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.addMany(['d', 'e'])
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c', 'd', 'e'])
    expect(result.current.length).toBe(5)
  })

  it('should setOne element in the array (updateOne)', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.setOne({ index: 0, change: 'd' })
    })

    expect(result.current.array).toStrictEqual(['d', 'b', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should setOne element in the array (addOne)', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.setOne({ index: 4, change: 'd' })
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c', 'd'])
    expect(result.current.length).toBe(4)
  })

  it('should setMany elements in the array (update)', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.setMany([{ index: 0, change: 'd' }, { index: 1, change: 'e' }])
    })

    expect(result.current.array).toStrictEqual(['d', 'e', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should setMany elements in the array (add)', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.setMany([{ index: 4, change: 'd' }, { index: 5, change: 'e' }])
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c', 'd', 'e'])
    expect(result.current.length).toBe(5)
  })

  it('should setMany elements in the array (add and update)', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.setMany([{ index: 0, change: 'd' }, { index: 4, change: 'e' }])
    })

    expect(result.current.array).toStrictEqual(['d', 'b', 'c', 'e'])
    expect(result.current.length).toBe(4)
  })

  it('should setAll elements in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.setAll(['d', 'e'])
    })

    expect(result.current.array).toStrictEqual(['d', 'e'])
    expect(result.current.length).toBe(2)
  })

  it('should removeOne element in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.removeOne(0)
    })

    expect(result.current.array).toStrictEqual(['b', 'c'])
    expect(result.current.length).toBe(2)
  })

  it('should not removeOne element in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.removeOne(3)
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should removeMany elements in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.removeMany([0, 1])
    })

    expect(result.current.array).toStrictEqual(['c'])
    expect(result.current.length).toBe(1)
  })

  it('should not removeMany elements in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.removeMany([3, 4])
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should removeAll elements in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.removeAll()
    })

    expect(result.current.array).toStrictEqual([])
    expect(result.current.length).toBe(0)
  })

  it('should updateOne element in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.updateOne({ index: 0, change: 'd' })
    })

    expect(result.current.array).toStrictEqual(['d', 'b', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should not updateOne element in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.updateOne({ index: 5, change: 'd' })
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should updateMany elements in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.updateMany([{ index: 0, change: 'd' }, { index: 1, change: 'e' }])
    })

    expect(result.current.array).toStrictEqual(['d', 'e', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should reset the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.addMany(['d', 'e'])
      result.current.reset()
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should not updateMany element in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    act(() => {
      result.current.updateMany([{ index: 4, change: 'd' }, { index: 5, change: 'e' }])
    })

    expect(result.current.array).toStrictEqual(['a', 'b', 'c'])
    expect(result.current.length).toBe(3)
  })

  it('should select elements in the array', () => {
    const { result } = renderHook(() => useArray(['a', 'b', 'c']))

    expect(result.current.select()).toStrictEqual(['a', 'b', 'c'])

    expect(result.current.select((element) => element === 'a')).toStrictEqual(['a'])
    expect(result.current.some((element) => element === 'a')).toBeTruthy()

    expect(result.current.select((element) => element === 'd')).toStrictEqual([])
    expect(result.current.some((element) => element === 'd')).toBeFalsy()
  })

})

