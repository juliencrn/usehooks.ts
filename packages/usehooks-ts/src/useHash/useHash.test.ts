import { act, renderHook } from '@testing-library/react';

import { useHash } from './useHash';


describe('useHash()', () => {
  it('should update hash value on hashchange event', () => {
    const { result } = renderHook(() => useHash());

    // Simulate a hashchange event with a new hash value
    const newHash = "newHashValue";
    act(() => {
      window.location.hash = `#${newHash}`;
      const event = new Event('hashchange');
      window.dispatchEvent(event);
    });

    // Check if the hash value has been updated
    expect(result.current).toBe(newHash);
  });
});
