import { act, renderHook } from '@testing-library/react'

import { mockStorage } from '../../tests/mocks'
import { useLocalStorage } from './useLocalStorage'

mockStorage('localStorage')

describe('useLocalStorage()', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('initial state is in the returned state', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'))

    expect(result.current[0]).toBe('value')
  })

  it('Initial state is a callback function', () => {
    const { result } = renderHook(() => useLocalStorage('key', () => 'value'))

    expect(result.current[0]).toBe('value')
  })

  it('Initial state is an array', () => {
    const { result } = renderHook(() => useLocalStorage('digits', [1, 2]))

    expect(result.current[0]).toEqual([1, 2])
  })

  it('Initial state is a Map', () => {
    const { result } = renderHook(() =>
      useLocalStorage('map', new Map([['a', 1]])),
    )

    expect(result.current[0]).toEqual(new Map([['a', 1]]))
  })

  it('Initial state is a Set', () => {
    const { result } = renderHook(() => useLocalStorage('set', new Set([1, 2])))

    expect(result.current[0]).toEqual(new Set([1, 2]))
  })

  it('Initial state is a Date', () => {
    const { result } = renderHook(() =>
      useLocalStorage('date', new Date(2020, 1, 1)),
    )

    expect(result.current[0]).toEqual(new Date(2020, 1, 1))
  })

  it('Update the state', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'))

    act(() => {
      const setState = result.current[1]
      setState('edited')
    })

    expect(result.current[0]).toBe('edited')
  })

  it('Update the state writes localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'))

    act(() => {
      const setState = result.current[1]
      setState('edited')
    })

    expect(window.localStorage.getItem('key')).toBe(JSON.stringify('edited'))
  })

  it('Remove the state removes localStorage key', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'))

    act(() => {
      const setState = result.current[1]
      setState('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(window.localStorage.getItem('key')).toBe(JSON.stringify('updated'))

    act(() => {
      const removeValue = result.current[2]
      removeValue()
    })

    // Expect null as it's a default return if storage key doesn't exist
    expect(window.localStorage.getItem('key')).toBeNull()
    // Expect the state to match the default value
    expect(result.current[0]).toBe('value')
  })

  it('Update the state with undefined', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string | undefined>('key', 'value'),
    )

    act(() => {
      const setState = result.current[1]
      setState(undefined)
    })

    expect(result.current[0]).toBeUndefined()
  })

  it('Update the state with null', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string | null>('key', 'value'),
    )

    act(() => {
      const setState = result.current[1]
      setState(null)
    })

    expect(result.current[0]).toBeNull()
  })

  it('Update the state with a callback function', () => {
    const { result } = renderHook(() => useLocalStorage('count', 2))

    act(() => {
      const setState = result.current[1]
      setState(prev => prev + 1)
    })

    expect(result.current[0]).toBe(3)
    expect(window.localStorage.getItem('count')).toEqual('3')
  })

  it('Update the state with a callback function multiple times per render', () => {
    const { result } = renderHook(() => useLocalStorage('count', 2))

    act(() => {
      const setState = result.current[1]
      setState(prev => prev + 1)
      setState(prev => prev + 1)
      setState(prev => prev + 1)
    })

    expect(result.current[0]).toBe(5)
    expect(window.localStorage.getItem('count')).toEqual('5')
  })

  it('[Event] Update one hook updates the others', () => {
    const initialValues: [string, unknown] = ['key', 'initial']
    const { result: A } = renderHook(() => useLocalStorage(...initialValues))
    const { result: B } = renderHook(() => useLocalStorage(...initialValues))
    const { result: C } = renderHook(() =>
      useLocalStorage('other-key', 'initial'),
    )

    act(() => {
      const setState = A.current[1]
      setState('edited')
    })

    expect(B.current[0]).toBe('edited')
    expect(C.current[0]).toBe('initial')
  })

  it('[Event] Updating one hook does not update others with a different key', () => {
    let renderCount = 0
    const { result: A } = renderHook(() => {
      renderCount++
      return useLocalStorage('key1', {})
    })
    const { result: B } = renderHook(() => useLocalStorage('key2', 'initial'))

    expect(renderCount).toBe(1)

    act(() => {
      const setStateA = A.current[1]
      setStateA({ a: 1 })
    })

    expect(renderCount).toBe(2)

    act(() => {
      const setStateB = B.current[1]
      setStateB('edited')
    })

    expect(renderCount).toBe(2)
  })

  it('setValue is referentially stable', () => {
    const { result } = renderHook(() => useLocalStorage('count', 1))

    // Store a reference to the original setValue
    const originalCallback = result.current[1]

    // Now invoke a state update, if setValue is not referentially stable then this will cause the originalCallback
    // reference to not be equal to the new setValue function
    act(() => {
      const setState = result.current[1]
      setState(prev => prev + 1)
    })

    expect(result.current[1] === originalCallback).toBe(true)
  })

  it('should use default JSON.stringify and JSON.parse when serializer/deserializer not provided', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initialValue'))

    act(() => {
      result.current[1]('newValue')
    })

    expect(localStorage.getItem('key')).toBe(JSON.stringify('newValue'))
  })

  it('should use custom serializer and deserializer when provided', () => {
    const serializer = (value: string) => value.toUpperCase()
    const deserializer = (value: string) => value.toLowerCase()

    const { result } = renderHook(() =>
      useLocalStorage('key', 'initialValue', { serializer, deserializer }),
    )

    act(() => {
      result.current[1]('NewValue')
    })

    expect(localStorage.getItem('key')).toBe('NEWVALUE')
  })

  it('should handle undefined values with custom deserializer', () => {
    const serializer = (value: number | undefined) => String(value)
    const deserializer = (value: string) =>
      value === 'undefined' ? undefined : Number(value)

    const { result } = renderHook(() =>
      useLocalStorage<number | undefined>('key', 0, {
        serializer,
        deserializer,
      }),
    )

    act(() => {
      result.current[1](undefined)
    })

    expect(localStorage.getItem('key')).toBe('undefined')

    act(() => {
      result.current[1](42)
    })

    expect(localStorage.getItem('key')).toBe('42')
  })

  it('should set local storage value to initial if not exists and `setItemIfNotExists` is true', () => {
    const LOCAL_STORAGE_KEY = 'key'
    const INITIAL_VALUE = 'initial_value'
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull()

    renderHook(() =>
      useLocalStorage(LOCAL_STORAGE_KEY, INITIAL_VALUE, {
        setItemIfNotExists: true,
      }),
    )

    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe(
      JSON.stringify(INITIAL_VALUE),
    )
  })

  it('should not set local storage value to initial if not exists and `setItemIfNotExists` is false', () => {
    const LOCAL_STORAGE_KEY = 'key'
    const INITIAL_VALUE = 'initial_value'
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull()

    renderHook(() =>
      useLocalStorage(LOCAL_STORAGE_KEY, INITIAL_VALUE, {
        setItemIfNotExists: false,
      }),
    )

    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull()
  })
})
