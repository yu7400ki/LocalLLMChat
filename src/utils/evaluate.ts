export const notNull = <T>(value: T | null): value is T => {
  return value !== null;
};
