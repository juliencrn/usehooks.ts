import { useState } from 'react'

import { useEscclose } from './useEscclose'

// Example Like Modal Component
export default function Component() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  useEscclose(isOpen, handleClose)

  return <div>Put a Component to close on esc(ex. modal)</div>
}
