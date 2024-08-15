import { useState } from 'react'

import { act, renderHook } from '@testing-library/react'

import { useThrottle } from './useThrottle'

describe('use throttle()', () => {
  it('shoud use thorttle be ok', () => {
    const { result } = renderHook(() => useThrottle())
    const throttle = result.current

    expect(typeof throttle).toBe('function')
  })

  it('shoud default value works', () => {
    const countRender = renderHook(() => useState(0))
    const [count, setCount] = countRender.result.current

    const throttleRender = renderHook(() => useThrottle())
    const throttle = throttleRender.result.current

    act(() => {
      throttle(() => {
        setCount(state => state + 1)
      })

      throttle(() => {
        setCount(state => state + 1)
      })

      setTimeout(() => {
        expect(count).toBe(1)
      }, 1000)
    })
  })

  it('shoud interval param works', () => {
    const countRender = renderHook(() => useState(0))
    const [count, setCount] = countRender.result.current

    const throttleRender = renderHook(() => useThrottle())
    const throttle = throttleRender.result.current

    act(() => {
      throttle(() => {
        setCount(state => state + 1)
      }, 1)

      throttle(() => {
        setCount(state => state + 1)
      }, 1)

      throttle(() => {
        setCount(state => state + 1)
      }, 2)

      setTimeout(() => {
        expect(count).toBe(2)
      }, 1000)
    })
  })
})
