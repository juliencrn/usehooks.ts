import { useCookie } from './useCookie'

export default function Component() {
  const [message, setMessage, deleteMessage] = useCookie('testMessageString')
  return (
    <div>
      <input
        value={message}
        placeholder="Please enter some words to update cookie..."
        onChange={e => {
          setMessage(e.target.value)
        }}
        style={{ width: 300 }}
      />
      <button onClick={deleteMessage}>delete mesesage</button>
    </div>
  )
}
