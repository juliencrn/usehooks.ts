import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction, MouseEvent } from 'react';

/**
 * Structure of the return value for `useContextMenu`.
 */
type UseContextMenuReturn = {
  /** State indicating if the context menu is open. */
  isOpen: boolean;
  /** Coordinates for the context menu position. */
  position: {
    x: number;
    y: number;
  };
  /** Toggle function for the `isOpen` state. */
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  /** Function to update the context menu position. */
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  /** Function to handle right-click to open the context menu at cursor position. */
  handleContextMenu: (event: MouseEvent) => void;
};

/**
 * Custom hook to manage a context menu's visibility and position.
 *
 * This hook provides:
 * - `isOpen`: Boolean state indicating visibility of the context menu.
 * - `position`: An object containing `x` and `y` coordinates for the context menu.
 * - `setIsOpen` and `setPosition`: Functions to control the menu state and position.
 *
 * By default, the context menu is hidden, and its initial position is `{ x: 0, y: 0 }`.
 * The hook automatically closes the menu when a click is detected anywhere on the document.
 *
 * @param {boolean} [initialOpen=false] - Initial visibility of the context menu.
 * @param {{ x: number; y: number }} [initialPosition={ x: 0, y: 0 }] - Initial position of the context menu.
 * @returns {UseContextMenuReturn} Object containing `isOpen`, `position`, and handler functions.
 *
 * @example
 * ```tsx
 * const { isOpen, setIsOpen, position, setPosition, handleContextMenu } = useContextMenu();
 * ```
 *
 * @public
 */
export function useContextMenu(
  initialOpen: boolean = false,
  initialPosition: { x: number; y: number } = { x: 0, y: 0 }
): UseContextMenuReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [position, setPosition] = useState<{ x: number; y: number }>(initialPosition);

  useEffect(() => {
    /** Hide the context menu on any outside click */
    const handleClickOutside = () => setIsOpen(false);

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /**
   * Opens the context menu at the cursor's position on right-click.
   * @param {MouseEvent} event - Mouse event triggered by right-click.
   */
  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX + 2, y: event.clientY - 6 });
    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen,
    position,
    setPosition,
    handleContextMenu,
  };
}
