export function toNumber(value: any): number;
export function toNumber<D>(value: any, _default: D): number | D;
export function toNumber(val: any, _default?: number) {

  const num = typeof val === 'number'
  ? val
  : typeof val === 'string' && val.length
    ? +val
    : _default;
  return isNaN(num as any) ? (_default === void 0 ? 0 : _default) : num;
}
