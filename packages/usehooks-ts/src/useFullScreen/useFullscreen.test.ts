import { renderHook, act } from '@testing-library/react-hooks';
import { useFullscreen } from './useFullscreen';

describe('useFullscreen', () => {
  test('should initialize with default values', () => {
    const containerRef = { current: null } as any;
    const { result } = renderHook(() => useFullscreen(containerRef));

    expect(result.current.isFullscreen).toBe(false);
  });

  test('should toggle fullscreen mode when toggleFullscreen is called', () => {
    const containerRef = {
      current: {
        requestFullscreen: jest.fn(),
      },
    } as any;

    const { result } = renderHook(() => useFullscreen(containerRef));

    act(() => result.current.toggleFullscreen());
    expect(containerRef.current.requestFullscreen).toHaveBeenCalled();
  });

  test('should exit fullscreen mode when exitFullscreen is called', () => {
    document.exitFullscreen = jest.fn();

    const containerRef = { current: null } as any;
    const { result } = renderHook(() => useFullscreen(containerRef));

    act(() => result.current.exitFullscreen());
    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  test('should update isFullscreen state when fullscreenchange event occurs', () => {
    const containerRef = { current: null } as any;
    const { result } = renderHook(() => useFullscreen(containerRef));

    act(() => {
      document.dispatchEvent(new Event('fullscreenchange'));
    });

    expect(result.current.isFullscreen).toBe(false);

    act(() => {
      Object.defineProperty(document, 'fullscreenElement', { value: {}, configurable: true });
      document.dispatchEvent(new Event('fullscreenchange'));
    });

    expect(result.current.isFullscreen).toBe(true);
  });
});
