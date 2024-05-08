import { useArray } from './useArray'

export default function Component() {
  const { value, push, removeByIndex } = useArray<number>([1, 2, 3])

  return (
    <>
      <div>
        <div>Array: {JSON.stringify(value)}</div>
        <button
          onClick={() => {
            push(4)
          }}
        >
          Add 4
        </button>
        <button
          onClick={() => {
            removeByIndex(1)
          }}
        >
          Remove at index 1
        </button>
      </div>
    </>
  )
}
