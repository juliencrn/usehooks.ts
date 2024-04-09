import { useHash } from './useHash'

function Component() {
  const hash = useHash();

  return (
    <div>
      <h1>Hash String: {hash} </h1>
      {/* Your component JSX */}
    </div>
  );
}

export default Component;
