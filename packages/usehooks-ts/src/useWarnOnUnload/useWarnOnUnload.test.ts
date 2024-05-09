import { renderHook } from '@testing-library/react'

import { useWarnOnUnload } from './useWarnOnUnload'

describe('useWarnOnUnload()', () => {
  it('should not prevent unloading when hasWarn is false', () => {
    const { rerender } = renderHook(
      ({ hasWarn }) => {
        useWarnOnUnload({ hasWarn })
      },
      {
        initialProps: { hasWarn: false },
      },
    )

    const event = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)

    rerender({ hasWarn: true })
    const event2 = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event2)
    expect(event2.defaultPrevented).toBe(true)

    rerender({ hasWarn: false })
    const event3 = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event3)
    expect(event3.defaultPrevented).toBe(false)
  })

  it('should prevent unloading when hasWarn is true', () => {
    const { rerender } = renderHook(
      ({ hasWarn }) => {
        useWarnOnUnload({ hasWarn })
      },
      {
        initialProps: { hasWarn: true },
      },
    )

    const event = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)

    rerender({ hasWarn: false })
    const event2 = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event2)
    expect(event2.defaultPrevented).toBe(false)
  })
})
