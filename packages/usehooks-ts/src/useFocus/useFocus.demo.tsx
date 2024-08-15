import { useFocus } from './useFocus'

export default function Component() {
  const [ref, isFocused] = useFocus<HTMLInputElement>((focusState: boolean) => {
    console.log('Focus state:', focusState)
  })

  return (
    <div>
      <input ref={ref} type="text" placeholder="Focus me!" />
      <p>The input is currently {isFocused ? 'focused' : 'unfocused'}</p>
    </div>
  )
}
