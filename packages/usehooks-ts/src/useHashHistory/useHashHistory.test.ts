import { renderHook } from '@testing-library/react';
import { useHashHistory } from './useHashHistory';

describe('useHashHistory()', () => {
  let originalHash: string;
  let originalRemoveEventListener: any;

  beforeEach(() => {
    originalHash = window.location.hash;
    originalRemoveEventListener = window.removeEventListener;

  });

  afterEach(() => {
    window.location.hash = originalHash;
    window.removeEventListener = originalRemoveEventListener; // Restore removeEventListener
  });

  it('should initialize with the current hash', () => {
    const { result } = renderHook(() => useHashHistory());

    expect(result.current).toEqual([originalHash]);
  });

  it('should update history array when hash changes', () => {
    const { result } = renderHook(() => useHashHistory());

    // Simulate a hashchange event with a new hash value
    const newHash = "#newHash";
    window.location.hash = newHash;
    const event = new Event('hashchange');
    window.dispatchEvent(event);

    expect(result.current).toEqual([originalHash, newHash]);
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useHashHistory());
    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith('hashchange', expect.any(Function));
  });
});
