import { act, renderHook } from '@testing-library/react'

import { useEscclose } from './useEscclose'

describe('useEscclose()', () => {
  let onCloseMock: jest.Mock

  beforeEach(() => {
    onCloseMock = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should not call onClose if isOpen is false', () => {
    renderHook(() => {
      useEscclose(false, onCloseMock)
    })

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      window.dispatchEvent(event)
    })

    expect(onCloseMock).not.toHaveBeenCalled()
  })

  it('should call onClose when ESC key is pressed and isOpen is true', () => {
    renderHook(() => {
      useEscclose(true, onCloseMock)
    })

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      window.dispatchEvent(event)
    })

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose for other keys', () => {
    renderHook(() => {
      useEscclose(true, onCloseMock)
    })

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      window.dispatchEvent(event)
    })

    expect(onCloseMock).not.toHaveBeenCalled()
  })

  it('should clean up the event listener on unmount', () => {
    const { unmount } = renderHook(() => {
      useEscclose(true, onCloseMock)
    })

    act(() => {
      unmount()
    })

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      window.dispatchEvent(event)
    })

    expect(onCloseMock).not.toHaveBeenCalled()
  })
})
