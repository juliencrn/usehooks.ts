import { useCopyToClipboard } from './useCopyToClipboard'

export default function Component() {
  const [copiedText, copy] = useCopyToClipboard()

  const handleCopy = (text: string) => () => {
    copy(text).then(success => {
      if (success) {
        console.log('Copied!', { text })
      } else {
        console.error('Failed to copy!')
      }
    })
  }

  return (
    <>
      <h1>Click to copy:</h1>
      <div style={{ display: 'flex' }}>
        <button onClick={handleCopy('A')}>A</button>
        <button onClick={handleCopy('B')}>B</button>
        <button onClick={handleCopy('C')}>C</button>
      </div>
      <p>Copied value: {copiedText ?? 'Nothing is copied yet!'}</p>
    </>
  )
}
