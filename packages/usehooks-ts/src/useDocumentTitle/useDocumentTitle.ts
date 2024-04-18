import { useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'
import { useUnmount } from '../useUnmount'

/** Hook options. */
type UseDocumentTitleOptions = {
  /** Whether to keep the title after unmounting the component (default is `true`). */
  preserveTitleOnUnmount?: boolean
}

/**
 * Custom hook that sets the document title.
 * @param {string} title - The title to set.
 * @param {?UseDocumentTitleOptions} [options] - The options.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-document-title)
 * @example
 * ```tsx
 * useDocumentTitle('My new title');
 * ```
 */
export function useDocumentTitle(
  title: string | undefined,
  options: UseDocumentTitleOptions = {},
): void {
  const { preserveTitleOnUnmount = true } = options
  const defaultTitle = useRef<string | null>(null)

  useIsomorphicLayoutEffect(() => {
    defaultTitle.current = window.document.title
  }, [])

  useIsomorphicLayoutEffect(() => {
    window.document.title = title ?? defaultTitle.current ?? ''
  }, [title])

  useUnmount(() => {
    if (!preserveTitleOnUnmount && defaultTitle.current) {
      window.document.title = defaultTitle.current
    }
  })
}
