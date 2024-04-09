import { act, renderHook } from '@testing-library/react';
import { useClipboard } from './useClipboard';


describe('useClipboard()', () => {
  it('should copy value to clipboard and reset isCopied state after timeout', async () => {
    const { result } = renderHook(() => useClipboard({ timeout: 2000 }));

    act(() => {
      result.current.copyToClipboard('test value');
    });

    // The isCopied state should be true immediately after copying
    expect(result.current.isCopied).toBe(true);

    // Fast-forward time by 2000 milliseconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // The isCopied state should be reset to false after the timeout
    expect(result.current.isCopied).toBe(false);
  });
});

