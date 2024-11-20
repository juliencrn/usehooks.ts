import { renderHook, act } from '@testing-library/react-hooks';
import { useContextMenu } from './useContextMenu';

describe('useContextMenu', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useContextMenu());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.position).toEqual({ x: 0, y: 0 });
  });

  test('should initialize with provided initial values', () => {
    const initialOpen = true;
    const initialPosition = { x: 50, y: 50 };
    const { result } = renderHook(() => useContextMenu(initialOpen, initialPosition));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.position).toEqual(initialPosition);
  });

  test('should toggle isOpen state', () => {
    const { result } = renderHook(() => useContextMenu());

    act(() => result.current.setIsOpen(true));
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.setIsOpen(false));
    expect(result.current.isOpen).toBe(false);
  });

  test('should update position state', () => {
    const { result } = renderHook(() => useContextMenu());

    const newPosition = { x: 20, y: 20 };
    act(() => result.current.setPosition(newPosition));
    expect(result.current.position).toEqual(newPosition);
  });

  test('should close context menu when document is clicked', () => {
    const { result } = renderHook(() => useContextMenu(true));

    expect(result.current.isOpen).toBe(true);

    act(() => {
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(result.current.isOpen).toBe(false);
  });
});
