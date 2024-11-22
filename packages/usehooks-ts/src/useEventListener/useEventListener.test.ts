/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { fireEvent, renderHook } from '@testing-library/react'

import { useEventListener } from './useEventListener'

declare global {
  interface WindowEventMap {
    'test-event': CustomEvent
  }

  interface HTMLElementEventMap {
    'test-event': CustomEvent
  }

  interface SVGElementEventMap {
    'test-event': CustomEvent
  }

  interface DocumentEventMap {
    'test-event': CustomEvent
  }

  /** Since TestTarget not at ElementsToEventMap, we need to use an EventMap generic override */
  interface TestTargetEventMap {
    'boundary': SpeechSynthesisEvent
  }
}

const windowAddEventListenerSpy = vitest.spyOn(window, 'addEventListener')
const windowRemoveEventListenerSpy = vitest.spyOn(window, 'removeEventListener')

const ref = { current: document.createElement('div') }
const refAddEventListenerSpy = vitest.spyOn(ref.current, 'addEventListener')
const refRemoveEventListenerSpy = vitest.spyOn(
  ref.current,
  'removeEventListener',
)

const docRef = { current: window.document }
const docAddEventListenerSpy = vitest.spyOn(docRef.current, 'addEventListener')
const docRemoveEventListenerSpy = vitest.spyOn(
  docRef.current,
  'removeEventListener',
)

class TestTarget extends EventTarget {}
const testTarget = new TestTarget()
const targetAddEventListenerSpy = vitest.spyOn(testTarget, 'addEventListener')
const targetRemoveEventListenerSpy = vitest.spyOn(
  testTarget,
  'removeEventListener',
)

describe('useEventListener()', () => {
  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('should bind/unbind the event listener to the window when element is not provided', () => {
    const eventName = 'test-event'
    const handler = vitest.fn()
    const options = undefined

    const { unmount } = renderHook(() => {
      useEventListener(eventName, handler)
    })

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )

    unmount()

    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )
  })

  it('should bind/unbind the event listener to the element when element is provided', () => {
    const eventName = 'test-event'
    const handler = vitest.fn()
    const options = undefined

    const { unmount } = renderHook(() => {
      useEventListener(eventName, handler, { element: ref, options })
    })

    expect(refAddEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(refAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )

    unmount()

    expect(refRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )
  })

  it('should bind/unbind the event listener to the EventTarget when EventTarget is provided', () => {
    const eventName = 'boundary'
    const handler = vitest.fn()
    const options = undefined

    const { unmount } = renderHook(() => {
      useEventListener<TestTargetEventMap>("boundary", handler, { element: testTarget, options })
    })

    expect(targetAddEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(targetAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )

    unmount()

    expect(targetRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )
  })

  it('should bind/unbind the event listener to the document when document is provided', () => {
    const eventName = 'test-event'
    const handler = vitest.fn()
    const options = undefined

    const { unmount } = renderHook(() => {
      useEventListener(eventName, handler, { element: docRef, options })
    })

    expect(docAddEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(docAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )

    unmount()

    expect(docRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )
  })

  it('should pass the options to the event listener', () => {
    const eventName = 'test-event'
    const handler = vitest.fn()
    const options = {
      passive: true,
      once: true,
      capture: true,
    }

    renderHook(() => {
      useEventListener(eventName, handler, { options })
    })

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options,
    )
  })

  it('should call the event listener handler when the event is triggered', () => {
    const eventName = 'click'
    const handler = vitest.fn()

    renderHook(() => {
      useEventListener(eventName, handler, { element: ref })
    })

    fireEvent.click(ref.current)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should have the correct event type', () => {
    const clickHandler = vitest.fn()
    const keydownHandler = vitest.fn()

    renderHook(() => {
      useEventListener('click', clickHandler, { element: ref })
    })
    renderHook(() => {
      useEventListener('keydown', keydownHandler, { element: ref })
    })

    fireEvent.click(ref.current)
    fireEvent.keyDown(ref.current)

    expect(clickHandler).toHaveBeenCalledWith(expect.any(MouseEvent))
    expect(keydownHandler).toHaveBeenCalledWith(expect.any(KeyboardEvent))
  })
})
