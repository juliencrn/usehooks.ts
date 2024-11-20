import { useEffect, useState, RefObject } from 'react';

/**
 * Structure of the return value for `useFullscreen`.
 */
type UseFullscreenReturn = {
  /** State indicating if fullscreen mode is active. */
  isFullscreen: boolean;
  /** Function to toggle fullscreen mode. */
  toggleFullscreen: () => void;
  /** Function to exit fullscreen mode. */
  exitFullscreen: () => void;
};

/**
 * Custom hook to manage fullscreen functionality for a given container.
 *
 * This hook provides:
 * - `isFullscreen`: Boolean state indicating if fullscreen mode is active.
 * - `toggleFullscreen`: A function to toggle fullscreen mode for the specified container.
 * - `exitFullscreen`: A function to exit fullscreen mode.
 *
 * By default, the fullscreen state is `false`. This hook listens to the
 * `fullscreenchange` event to automatically update the `isFullscreen` state.
 *
 * @param {RefObject<HTMLElement>} containerRef - A ref to the container element to manage fullscreen mode.
 * @returns {UseFullscreenReturn} Object containing fullscreen state and control functions.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen(containerRef);
 * ```
 *
 * @public
 */
export function useFullscreen(containerRef: RefObject<HTMLElement>): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  /**
   * Toggles fullscreen mode for the referenced container.
   */
  const toggleFullscreen = (): void => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      const element = containerRef.current;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen(); // For older Firefox
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen(); // For Safari
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen(); // For older IE
      }
    } else {
      exitFullscreen();
    }
  };

  /**
   * Exits fullscreen mode.
   */
  const exitFullscreen = (): void => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen(); // For older Firefox
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen(); // For Safari
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen(); // For older IE
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    exitFullscreen,
  };
}
