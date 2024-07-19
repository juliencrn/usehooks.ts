import React from 'react';
import { renderHook } from '@testing-library/react-hooks/dom';
import {usePrevious} from '..';

test('returns undefined for initial value', () => {
  const { result } = renderHook(() => usePrevious(0));

  expect(result.current).toBeUndefined();
});

test('returns previous value after update', () => {
  const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
    initialProps: { value: 0 },
  });

  expect(result.current).toBeUndefined();

  rerender({ value: 1 });

  expect(result.current).toBe(0);

  rerender({ value: 1 });

  expect(result.current).toBe(1);
});
