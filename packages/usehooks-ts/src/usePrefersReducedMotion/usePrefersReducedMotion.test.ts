import { act, renderHook } from '@testing-library/react'

import { mockMatchMedia } from '../../tests/mocks'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

describe('usePrefersReducedMotion()', () => {
  beforeEach(() => {
    //@ts-expect-error, Clearing the matchMedia mock
    window.matchMedia = undefined
  })

  it('should initiate correctly', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('should return false when the user has not set the preference', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('should return null when window.matchMedia is not available', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(null)
  })

  it("should react to changes in the user's preference", () => {
    let changeCallback: (event: MediaQueryListEvent) => void = () => {
      console.error('changeCallback not set')
    }

    window.matchMedia = vitest
      .fn()
      .mockImplementation((query: MediaQueryListEvent) => ({
        query,
        matches: false,
        addEventListener: (
          _: string,
          callback: (event: MediaQueryListEvent) => void,
        ) => {
          changeCallback = callback
        },
        removeEventListener: vitest.fn(),
        dispatchEvent: vitest.fn(),
      }))

    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)

    act(() => {
      changeCallback({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current).toBe(true)

    act(() => {
      changeCallback({ matches: false } as MediaQueryListEvent)
    })

    expect(result.current).toBe(false)
  })
})
