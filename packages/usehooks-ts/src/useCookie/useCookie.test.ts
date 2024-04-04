import { act, renderHook } from '@testing-library/react'

import { useCookie } from './useCookie'

describe('useCookie()', () => {
  it('should use cookie and no default value of options', () => {
    const {
      result: {
        current: [cookieValue, updateCookie, deleteCookie],
      },
    } = renderHook(() => useCookie('testKey'))

    expect(cookieValue).toBe(undefined)
    expect(typeof updateCookie).toBe('function')
    expect(typeof deleteCookie).toBe('function')
  })
  it('should use cookie and `string` default value of options', () => {
    const {
      result: {
        current: [cookieValue],
      },
    } = renderHook(() =>
      useCookie('testKey', {
        defaultValue: 'testStrValue',
      }),
    )
    expect(cookieValue).toBe('testStrValue')
  })
  it('should use cookie and `function` default value of options', () => {
    const {
      result: {
        current: [cookieValue],
      },
    } = renderHook(() =>
      useCookie('testKey1', {
        defaultValue: () => 'testFuncValue',
      }),
    )
    expect(cookieValue).toBe('testFuncValue')
  })
  it('should update cookie function', () => {
    const { result } = renderHook(() =>
      useCookie('testKey2', {
        defaultValue: 'testStrValue',
      }),
    )
    expect(result.current[0]).toBe('testStrValue')
    act(() => {
      result.current[1]('testNewValue')
    })
    expect(result.current[0]).toBe('testNewValue')
  })
  it('should delete cookie function', () => {
    const { result } = renderHook(() =>
      useCookie('testKey3', {
        defaultValue: 'testStrValue',
      }),
    )
    expect(result.current[0]).toBe('testStrValue')
    act(() => {
      result.current[2]()
    })
    expect(result.current[0]).toBe(undefined)
  })
})
