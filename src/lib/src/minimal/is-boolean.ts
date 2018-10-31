export function toBoolean(value: any) {
  return value != null && `${value}` !== 'false';
}
