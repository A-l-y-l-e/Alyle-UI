
export function memoize<T extends (key: number) => unknown>(fn: T): T;
export function memoize<T extends (key: string) => unknown>(fn: T): T;
export function memoize<T extends (key: string | number) => unknown>(fn: T): T {
  const cache: {
    [key: string]: unknown
  } = {};

  return ((key: string | number) => {
    if (cache[key] === undefined) {
      cache[key] = fn(key);
    }
    return cache[key] as unknown;
  }) as T;
}
