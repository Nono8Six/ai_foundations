export type NoInfer<T> = [T] extends [infer U] ? U : never;
