export function toNumber(val: any, _default?: number) {
  const value = Number(val);
  return _default && isNaN(value) ? _default : value;
}
