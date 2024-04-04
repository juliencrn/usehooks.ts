import { renderHook } from '@testing-library/react'

import {  } from './'

describe('()', () => {
  it('should  be ok', () => {
    const { result } = renderHook(() => ())
    const [value, setNumber] = result.current

    expect(value).toBe(2)
    expect(typeof setNumber).toBe('function')
  })
})

