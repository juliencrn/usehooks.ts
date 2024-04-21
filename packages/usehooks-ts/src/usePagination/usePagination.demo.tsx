import { useMemo } from 'react'

import { usePagination } from './usePagination'

export default function Component() {
  const data = useMemo(() => [1, 2, 3, 4, 5, 6, 7], [])

  const {
    isFirst,
    isLast,
    first,
    last,
    next,
    previous,
    pageNumber,
    totalPages,
    items,
  } = usePagination(data, { pageSize: 3 })

  return (
    <div>
      <div>{items.join(', ')}</div>
      <div>
        Page {pageNumber} of {totalPages}
      </div>
      <button disabled={isFirst} onClick={first}>
        {'<<'}
      </button>
      {'  '}
      <button disabled={isFirst} onClick={previous}>
        {'<'}
      </button>
      {'  '}
      <button disabled={isLast} onClick={next}>
        {'>'}
      </button>
      {'  '}
      <button disabled={isLast} onClick={last}>
        {'>>'}
      </button>
    </div>
  )
}
