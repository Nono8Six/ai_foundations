export type Result<T, E extends Error = Error> =
  | { data: T; error: null }
  | { data: null; error: E };
