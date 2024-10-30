import type { RefObject } from 'react'

import { useEventListener } from '../useEventListener'

/** Supported event types. */
type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout'

/**
 * Custom hook that handles clicks outside a specified element.
 * @template T - The type of the element's reference.
 * @param {RefObject<T> | RefObject<T>[]} ref - The React ref object(s) representing the element(s) to watch for outside clicks.
 * @param {(event: MouseEvent | TouchEvent | FocusEvent) => void} handler - The callback function to be executed when a click outside the element occurs.
 * @param {EventType} [eventType] - The mouse event type to listen for (optional, default is 'mousedown').
 * @param {?AddEventListenerOptions} [eventListenerOptions] - The options object to be passed to the `addEventListener` method (optional).
 * @returns {void}
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-on-click-outside)
 * @example
 * ```tsx
 * const containerRef = useRef(null);
 * useOnClickOutside([containerRef], () => {
 *   // Handle clicks outside the container.
 * });
 * ```
 */
export function useOnClickOutside<
  T extends HTMLElement | SVGElement = HTMLElement,
>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = 'mousedown',
  eventListenerOptions: AddEventListenerOptions = {},
): void {
  useEventListener(
    eventType,
    event => {
      const target = event.target as Node

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter(r => Boolean(r.current))
            .every(r => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target)

      if (isOutside) {
        handler(event)
      }
    },
    undefined,
    eventListenerOptions,
  )
}
