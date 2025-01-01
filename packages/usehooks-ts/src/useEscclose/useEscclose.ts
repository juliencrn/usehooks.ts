import { useEffect } from 'react'

/**
 * Custom hook that set handler to close element by ESC.
 * @param {boolean} [isOpen] - Boolean value if element is open.
 * @param {() => void} onClose - Function Logic to execute when closed.
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState<boolean>(false);
 *
 * const closeHandler = () => {
 *  setIsOpen(false);
 *  // ...Things to do when close
 * }
 *
 * const  = useEscclose(isOpen, closeHandler)
 * ```
 */
export function useEscclose(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
}
