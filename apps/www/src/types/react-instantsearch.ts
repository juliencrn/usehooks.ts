// TODO: remove after https://github.com/algolia/instantsearch/issues/6409 has been resolved

import type { ReactNode } from 'react'
import type { IndexProps, InstantSearchProps } from 'react-instantsearch'

declare module 'react-instantsearch' {
  export function InstantSearch(props: InstantSearchProps): ReactNode
  export function Index(props: IndexProps): ReactNode
}
