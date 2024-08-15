export type JSONObj = Record<string, unknown>;


export type PickFieldsWithType<T, V> =
  { [K in keyof T as T[K] extends V ? K : never]: T[K] };


export type PickProperties<T> =
  { [K in keyof T as T[K] extends Function ? never : K]: T[K] };