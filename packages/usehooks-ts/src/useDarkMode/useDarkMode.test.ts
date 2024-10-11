import { act, renderHook } from '@testing-library/react'

import { mockMatchMedia, mockStorage } from '../../tests/mocks'
import { useDarkMode } from './useDarkMode'

mockStorage('localStorage')

describe('useDarkMode()', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should initiate correctly', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useDarkMode())
    expect(typeof result.current.isDarkMode).toBe('boolean')
    expect(typeof result.current.disable).toBe('function')
    expect(typeof result.current.toggle).toBe('function')
    expect(typeof result.current.enable).toBe('function')
    expect(typeof result.current.set).toBe('function')
    expect(result.current.isDarkMode).toBe(false)
  })

  it('should have a default value', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(true)
  })

  it('should toggle dark mode', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(true)
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isDarkMode).toBe(false)
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isDarkMode).toBe(true)
  })

  it('should enable dark mode (1)', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(true)
    act(() => {
      result.current.enable()
    })
    expect(result.current.isDarkMode).toBe(true)
  })

  it('should enable dark mode (2)', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(false)
    act(() => {
      result.current.enable()
    })
    expect(result.current.isDarkMode).toBe(true)
  })

  it('should disable dark mode (1)', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(true)
    act(() => {
      result.current.disable()
    })
    expect(result.current.isDarkMode).toBe(false)
  })

  it('should disable dark mode (2)', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(false)
    act(() => {
      result.current.disable()
    })
    expect(result.current.isDarkMode).toBe(false)
  })

  it('should set dark mode', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useDarkMode())
    act(() => {
      result.current.set(false)
    })
    expect(result.current.isDarkMode).toBe(false)
    act(() => {
      result.current.set(true)
    })
    expect(result.current.isDarkMode).toBe(true)
  })

  it('should accept a custom localStorage key', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() =>
      useDarkMode({ localStorageKey: 'custom-key' }),
    )

    expect(result.current.isDarkMode).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isDarkMode).toBe(true)
    expect(window.localStorage.getItem('custom-key')).toBe(JSON.stringify(true))
  })

  it('should accept a custom default value', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() =>
      useDarkMode({ defaultValue: true, initializeWithValue: false }),
    )

    expect(result.current.isDarkMode).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isDarkMode).toBe(false)
  })

  it('should update dark mode when OS preference changes', () => {
    const { updateMatches } = mockMatchMedia(false)
    const { result, rerender } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(false)
    updateMatches(true)
    rerender() // trigger `useIsomorphicLayoutEffect`
    expect(result.current.isDarkMode).toBe(true)
  })

  it('should prioritize localStorage value over OS dark mode on page load', () => {
    window.localStorage.setItem('custom-key', JSON.stringify(false))

    mockMatchMedia(true)
    const { result } = renderHook(() =>
      useDarkMode({ localStorageKey: 'custom-key', initializeWithValue: true }),
    )
    expect(result.current.isDarkMode).toBe(false)

    act(() => {
      result.current.toggle()
    })
    expect(result.current.isDarkMode).toBe(true)
    expect(window.localStorage.getItem('custom-key')).toBe(JSON.stringify(true))
  })
})
