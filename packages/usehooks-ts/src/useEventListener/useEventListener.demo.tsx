import { useRef } from 'react'

import { useEventListener } from './useEventListener'

export default function Component() {
  // Define button ref
  const buttonRef = useRef<HTMLButtonElement>(null)
  const speechSynthesisRef = useRef(new SpeechSynthesis())

  const onScroll = (event: Event) => {
    console.log('window scrolled!', event)
  }

  const onClick = (event: Event) => {
    console.log('button clicked!', event)
  }

  const onVisibilityChange = (event: Event) => {
    console.log('doc visibility changed!', {
      isVisible: !document.hidden,
      event,
    })
  }

  // example with window based event
  useEventListener('scroll', onScroll)

  // example with EventTarget element based event
  useEventListener('voiceschanged', ev => console.log('speech!', ev), { element: speechSynthesisRef })

  // example with document based event
  useEventListener('visibilitychange', onVisibilityChange, {element: document })

  // example with element based event
  useEventListener('click', onClick, { element: buttonRef })

  return (
    <div style={{ minHeight: '200vh' }}>
      <button ref={buttonRef}>Click me</button>
    </div>
  )
}
