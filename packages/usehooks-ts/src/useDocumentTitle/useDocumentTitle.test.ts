import { renderHook } from '@testing-library/react'

import { useDocumentTitle } from './useDocumentTitle'

describe('useDocumentTitle()', () => {
  it('title should be in the document', () => {
    renderHook(() => {
      useDocumentTitle('foo')
    })
    expect(window.document.title).toEqual('foo')
  })

  it('should unset title on unmount with `preserveTitleOnUnmount` options to `false`', () => {
    window.document.title = 'initial'
    const { unmount } = renderHook(() => {
      useDocumentTitle('updated', { preserveTitleOnUnmount: false })
    })
    expect(window.document.title).toEqual('updated')
    unmount()
    expect(window.document.title).toEqual('initial')
  })

  it("shouldn't unset title on unmount with `preserveTitleOnUnmount` options to `true` (default)", () => {
    window.document.title = 'initial'
    const { unmount } = renderHook(() => {
      useDocumentTitle('updated')
    })
    expect(window.document.title).toEqual('updated')
    unmount()
    expect(window.document.title).toEqual('updated')
  })

  it('should unset title on provide `undefined` title', () => {
    window.document.title = 'initial'
    const { rerender } = renderHook(useDocumentTitle)
    rerender('updated')
    expect(window.document.title).toEqual('updated')
    rerender('updated again')
    expect(window.document.title).toEqual('updated again')
    rerender(undefined)
    expect(window.document.title).toEqual('initial')
  })
})
