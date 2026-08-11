export type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string }
