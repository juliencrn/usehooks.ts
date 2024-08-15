import { useState } from 'react'

import { useEventListener } from 'src/useEventListener'

import { useThrottle } from './useThrottle'

export default function Component() {
  const [state, setState] = useState<number>(0)
  const throttle = useThrottle()

  const onScroll = () => {
    throttle(() => {
      setState(state => state + 1)
    }, 1000)
  }

  useEventListener('scroll', onScroll)

  return (
    <div>
      <span>{state}</span>
    </div>
  )
}
