// generic preserves the type inference of union types
export function setAsUndefinedInsteadOfEmptyString<T extends string>(value: T) {
  return value === "" ? undefined : value;
}
