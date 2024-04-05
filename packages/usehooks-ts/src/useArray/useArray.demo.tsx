import { useArray } from './useArray'

export default function Component() {
  const { array, length, addOne, removeOne } = useArray<number>()

  return <div>
    {
      array.map((value, index) => <div>
          <p>Value: {value}</p>
          <button onClick={() => removeOne(index)} />
        </div>
      )
    }
    <button onClick={() => addOne(length)}/>
  </div>
}
