import { useEffect, useRef, useState } from 'react'

import type { RefObject } from 'react'

import { useIsMounted } from '../useIsMounted'

/** The size of the observed element. */
type Size = {
  /** The width of the observed element. */
  width: number | undefined
  /** The height of the observed element. */
  height: number | undefined
}

/** The options for the ResizeObserver. */
type UseResizeObserverOptions<
  T extends HTMLElement | SVGElement = HTMLElement,
> = {
  /** The ref of the element to observe. */
  ref: RefObject<T>
  /**
   * When using `onResize`, the hook doesn't re-render on element size changes; it delegates handling to the provided callback.
   * @default undefined
   */
  onResize?: (size: Size) => void
  /**
   * The box model to use for the ResizeObserver.
   * @default 'content-box'
   */
  box?: 'border-box' | 'content-box' | 'device-pixel-content-box'
}

const initialSize: Size = {
  width: undefined,
  height: undefined,
}

/**
 * Custom hook that observes the size of an element using the [`ResizeObserver API`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).
 * @template T - The type of the element to observe.
 * @param {UseResizeObserverOptions<T>} options - The options for the ResizeObserver.
 * @returns {Size} - The size of the observed element.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-resize-observer)
 * @example
 * ```tsx
 * const myRef = useRef(null);
 * const { width = 0, height = 0 } = useResizeObserver({
 *   ref: myRef,
 *   box: 'content-box',
 * });
 *
 * <div ref={myRef}>Hello, world!</div>
 * ```
 */
export function useResizeObserver<
  T extends HTMLElement | SVGElement = HTMLElement,
>(options: UseResizeObserverOptions<T>): Size {
  const { ref, box = 'content-box' } = options
  const [{ width, height }, setSize] = useState<Size>(initialSize)
  const isMounted = useIsMounted()
  const previousSize = useRef<Size>({ ...initialSize })
  const onResize = useRef<((size: Size) => void) | undefined>(undefined)
  onResize.current = options.onResize

  useEffect(() => {
    if (!ref.current) return

    if (typeof window === 'undefined' || !('ResizeObserver' in window)) return

    const observer = new ResizeObserver(([entry]) => {
      const boxProp =
        box === 'border-box'
          ? 'borderBoxSize'
          : box === 'device-pixel-content-box'
            ? 'devicePixelContentBoxSize'
            : 'contentBoxSize'

      const newWidth = extractSize(entry, boxProp, 'inlineSize')
      const newHeight = extractSize(entry, boxProp, 'blockSize')

      const hasChanged =
        previousSize.current.width !== newWidth ||
        previousSize.current.height !== newHeight

      if (hasChanged) {
        const newSize: Size = { width: newWidth, height: newHeight }
        previousSize.current.width = newWidth
        previousSize.current.height = newHeight

        if (onResize.current) {
          onResize.current(newSize)
        } else {
          if (isMounted()) {
            setSize(newSize)
          }
        }
      }
    })

    observer.observe(ref.current, { box })

    return () => {
      observer.disconnect()
    }
  }, [box, ref, isMounted])

  return { width, height }
}

/** @private */
type BoxSizesKey = keyof Pick<
  ResizeObserverEntry,
  'borderBoxSize' | 'contentBoxSize' | 'devicePixelContentBoxSize'
>

function extractSize(
  entry: ResizeObserverEntry,
  box: BoxSizesKey,
  sizeType: keyof ResizeObserverSize,
): number | undefined {
  if (!entry[box]) {
    if (box === 'contentBoxSize') {
      return entry.contentRect[sizeType === 'inlineSize' ? 'width' : 'height']
    }
    return undefined
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : // @ts-ignore Support Firefox's non-standard behavior
      (entry[box][sizeType] as number)
}
