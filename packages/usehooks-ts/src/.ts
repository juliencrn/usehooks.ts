import { useState } from 'react'

import type { Dispatch, SetStateAction } from 'react'

/** Hook return type */
type ReturnType = {
  /** The value of ... */
  value: number
  /** A method to update the value of ... */
  setValue: Dispatch<SetStateAction<number>>
}

/**
 * Custom hook that ...
 * @param {boolean} [defaultValue] - The initial value for ... (default is `0`).
 * @returns {[number, Dispatch<SetStateAction<number>>]} A tuple containing ...
 * @see [Documentation](https://usehooks-ts.com/react-hook/)
 * @public
 * @example
 * ```tsx
 * const { value, setValue } = (2);
 *
 * console.log(value); // 2
 * ```
 */
export function (
  defaultValue?: number,
): ReturnType {
  const [value, setValue] = useState(defaultValue || 0)

  return { value, setValue }
}
