import { renderHook } from '@testing-library/react'

import { useFocus } from './useFocus'

describe('useFocus()', () => {
  it('The result must always be false initially', () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>())
    expect(result.current[1]).toBe(false)
  })
})
