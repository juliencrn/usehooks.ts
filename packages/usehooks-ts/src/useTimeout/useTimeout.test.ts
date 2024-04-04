import { act, renderHook } from '@testing-library/react'

import { useTimeout } from './useTimeout'

describe('useTimeout()', () => {
  beforeEach(() => {
    vitest.useFakeTimers()
  })

  afterEach(() => {
    vitest.useRealTimers()
  })

  it('should call the callback after 1 min', () => {
    const delay = 60000
    const callback = vitest.fn()

    const { result } = renderHook(() => useTimeout(callback, delay))

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isStopped).toBe(false)
    expect(result.current.isRunning).toBe(true)
    expect(result.current.isPaused).toBe(false)

    act(() => {
      vitest.advanceTimersByTime(delay)
    })

    expect(callback).toHaveBeenCalledOnce()
    expect(result.current.isStopped).toBe(true)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(false)
  })

  it('should not do anything if "delay" is null', () => {
    const delay = null
    const callback = vitest.fn()

    const { result } = renderHook(() => useTimeout(callback, delay))

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isStopped).toBe(true)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(false)

    act(() => {
      vitest.runAllTimers()
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should pause the timeout and not call the callback', () => {
    const delay = 60000
    const callback = vitest.fn()

    const { result } = renderHook(() => useTimeout(callback, delay))

    act(() => {
      vitest.advanceTimersByTime(1)
    })

    act(() => {
      result.current.pause()
    })

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isStopped).toBe(false)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(true)

    act(() => {
      vitest.advanceTimersByTime(delay)
    })

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isStopped).toBe(false)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(true)
  })

  it('should start a paused timeout and call the callback', () => {
    const delay = 60000
    const timeIncrement = delay / 2
    const callback = vitest.fn()

    const { result } = renderHook(() => useTimeout(callback, delay))

    act(() => {
      vitest.advanceTimersByTime(timeIncrement)
    })

    act(() => {
      result.current.pause()
    })

    act(() => {
      vitest.advanceTimersByTime(timeIncrement)
    })

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isStopped).toBe(false)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(true)

    act(() => {
      result.current.start()
    })

    act(() => {
      vitest.advanceTimersByTime(timeIncrement)
    })

    expect(callback).toHaveBeenCalledOnce()
    expect(result.current.isStopped).toBe(true)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(false)
  })

  it('should stop the timeout and not call the callback', () => {
    const delay = 60000
    const callback = vitest.fn()

    const { result } = renderHook(() => useTimeout(callback, delay))

    act(() => {
      vitest.advanceTimersByTime(1)
    })

    act(() => {
      result.current.stop()
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vitest.advanceTimersByTime(delay)
    })

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isStopped).toBe(true)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(false)
  })

  it('should reset a running timeout and call the callback after new timeout finishes', () => {
    const delay = 60000
    const timeIncrement = delay / 2
    const callback = vitest.fn()

    const { result } = renderHook(() => useTimeout(callback, delay))

    act(() => {
      vitest.advanceTimersByTime(timeIncrement)
    })

    act(() => {
      result.current.reset()
    })

    act(() => {
      vitest.advanceTimersByTime(timeIncrement)
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vitest.advanceTimersByTime(timeIncrement)
    })

    expect(callback).toHaveBeenCalledOnce()
  })

  it('should reset a finished timeout and end up calling the callback 2 times in total', () => {
    const delay = 60000
    const callback = vitest.fn()

    const { result } = renderHook(() => useTimeout(callback, delay))

    act(() => {
      vitest.advanceTimersByTime(delay)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.reset()
    })

    act(() => {
      vitest.advanceTimersByTime(delay)
    })

    expect(callback).toHaveBeenCalledTimes(2)
  })
})
