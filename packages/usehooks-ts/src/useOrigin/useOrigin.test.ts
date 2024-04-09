import { act, renderHook } from '@testing-library/react';
import { useOrigin } from './useOrigin';

describe('useOrigin()', () => {
  it('should return empty string if window.location.origin is not available', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { origin: '' }as unknown as Location;

    const { result } = renderHook(() => useOrigin());

    expect(result.current).toBe('');

    window.location = originalLocation;
  });

  it('should return empty string before component has mounted', () => {
    const { result } = renderHook(() => useOrigin());

    expect(result.current).toBe('');
  });

  it('should return window.location.origin after component has mounted', async () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { origin: 'https://usehooks-ts.com' } as unknown as Location;

    let result: any;
    await act(async () => {
      result = renderHook(() => useOrigin()).result;
    });

    expect(result.current).toBe('');

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)); // Waiting for the next microtask
    });

    expect(result.current).toBe('https://usehooks-ts.com');

    window.location = originalLocation;
  });
});
