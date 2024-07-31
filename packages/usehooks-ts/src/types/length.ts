import type { AbsoluteUnit, RelativeUnit } from './unit'

export type AbsoluteLength = `${number}${AbsoluteUnit}`

export type RelativeLength = `${number}${RelativeUnit}`

export type CustomLength<T extends string> = `${number}${T}`

export type Length = AbsoluteLength | RelativeLength
