import { renderHook } from '@testing-library/react'

import { useNetworkStatus } from './useNetworkStatus'

describe('useNetworkStatus()', () => {
  it('should useNetworkStatus be ok', () => {
    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isOnline).toBe(true)
  })
})
