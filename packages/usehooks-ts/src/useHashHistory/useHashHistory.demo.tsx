
import { useHashHistory } from "./useHashHistory";


function Component() {
  const hashHistory = useHashHistory();

  return (
    <div>
      <h1>Hash History:</h1>
      <ul>
        {hashHistory.map((hash, index) => (
          <li key={index}>{hash}</li>
        ))}
      </ul>
    </div>
  );
}

export default Component;
