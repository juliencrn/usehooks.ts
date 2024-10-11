/**
 * Mocks the matchMedia API.
 * @param {boolean} matches - True for dark, false for light.
 * @returns {object} An object with a function to change the matches value.
 * @example
 * mockMatchMedia(false)
 */
export const mockMatchMedia = (matches: boolean) => {
  type EventListener = (event: Event) => void
  const eventListeners: Record<string, EventListener[]> = {}

  const matchMedia = (query: string) => ({
    get matches() {
      return matches
    },
    media: query,
    onchange: null,
    addEventListener: vitest
      .fn()
      .mockImplementation((type: string, listener: EventListener) => {
        if (!eventListeners[type]) eventListeners[type] = []
        eventListeners[type].push(listener)
      }),
    removeEventListener: vitest
      .fn()
      .mockImplementation((type: string, listener: EventListener) => {
        eventListeners[type] = eventListeners[type]?.filter(l => l !== listener)
      }),
    dispatchEvent: vitest.fn().mockImplementation((event: Event) => {
      eventListeners[event.type]?.forEach(listener => {
        listener(event)
      })
      return true
    }),
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vitest.fn().mockImplementation(matchMedia),
  })

  return {
    /**
     * Updates the matches value. This will trigger the change event.
     * @param m - The new value for matches.
     * @example
     * mockMatchMedia(false).updateMatches(true)
     */
    updateMatches: (m: boolean) => {
      matches = m
      eventListeners.change?.forEach(listener => {
        listener(new Event('change'))
      })
    },
  }
}

/**
 * Mocks the Storage API.
 * @param {'localStorage' | 'sessionStorage'} name - The name of the storage to mock.
 * @example
 * mockStorage('localStorage')
 * // Then use window.localStorage as usual (it will be mocked)
 */
export const mockStorage = (name: 'localStorage' | 'sessionStorage'): void => {
  class StorageMock implements Omit<Storage, 'key' | 'length'> {
    store: Record<string, string> = {}

    clear() {
      this.store = {}
    }

    getItem(key: string) {
      return this.store[key] || null
    }

    setItem(key: string, value: unknown) {
      this.store[key] = String(value)
    }

    removeItem(key: string) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.store[key]
    }
  }

  Object.defineProperty(window, name, {
    value: new StorageMock(),
  })
}
