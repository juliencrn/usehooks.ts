import { useState } from 'react';
import { usePrevious } from '..';


export default function Counter() {
  const [count, setCount] = useState(0);


  const prevCount = usePrevious(count);



  return (
    <div>
      <p>Current Count: {count}</p>
      <button onClick={() => setCount(count - 1)}>Decrement Count</button>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>

      <p>Previous Count: {prevCount !== undefined ? prevCount : ''}</p>
      <p>Status: {prevCount === undefined ? '' : prevCount < count ? "Increased" : prevCount > count ? "Decreased" : ''}</p>
    </div>
  );
}
