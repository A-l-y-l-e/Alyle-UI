export function defaultEntry(value: string | number, defaultValue: string | number) {
  return value !== '' && value !== void 0 ? value : defaultValue;
}
