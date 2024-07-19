import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const prevValueRef = useRef<T | undefined>();

  useEffect(() => {

    prevValueRef.current = value;

  }, [value]);

  return prevValueRef.current;
}
