type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? never : K;
}[keyof T];
/*
  Recursively selects required keys. Example:
  type S = RecursiveRequiredObject<{ a: number; b?: number }>;
  // S -> { a: number } 
*/
export type RecursiveRequiredObject<T> = {
  [P in RequiredKeys<T>]: T[P] extends Record<string, unknown> | undefined
    ? RecursiveRequiredObject<T[P]>
    : T[P];
};
