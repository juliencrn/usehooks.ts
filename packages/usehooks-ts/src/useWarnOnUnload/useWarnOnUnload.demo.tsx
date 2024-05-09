import { useState } from 'react'

import type { ChangeEvent } from 'react'

import { useWarnOnUnload } from './useWarnOnUnload'

export default function App() {
  const [content, setContent] = useState<string>('')

  const onChangeContent = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target
    setContent(value)
  }

  useWarnOnUnload({ hasWarn: content.length > 0 })

  return (
    <input value={content} onChange={onChangeContent} placeholder="input!" />
  )
}
