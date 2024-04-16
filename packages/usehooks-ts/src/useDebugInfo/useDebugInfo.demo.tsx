import { useState } from 'react'
import useDebugInfo from './useDebugInfo'

export default function Component({ title = '', initialCount = 0 }) {
  const [string, setString] = useState('0')

  const debugInfo = useDebugInfo(
    'ExampleComponent',
    {
      // provide all props that we want to observe for changes
      title,
      initialCount,
      string,
    },
    true,
  ) // optional param 'logOnlyWhenPropsChange' to not be spammed in the console
  // when component renders too much without any of the observed props changing
  return (
    <>
      <h5>Title: {title}</h5>
      <p>String: {string}</p>
      <button onClick={() => setString(prevS => String(Number(prevS) + 1))}>
        Increment String
      </button>
    </>
  )
}
