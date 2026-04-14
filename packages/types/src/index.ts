export type Primitive =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined

export type NestedPath<T> = T extends Primitive | readonly unknown[]
  ? never
  : {
      [K in Extract<keyof T, string>]: T[K] extends
        | Primitive
        | readonly unknown[]
        ? K
        : K | `${K}.${NestedPath<T[K]>}`
    }[Extract<keyof T, string>]

/**
 * A value that may be returned synchronously or asynchronously.
 */
export type MaybePromise<T> = Promise<T> | T
