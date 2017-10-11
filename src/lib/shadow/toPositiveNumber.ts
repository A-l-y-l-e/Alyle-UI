/**
 * Converter number to positive
 */
export function toPositiveNumber(val: number, state = false): number {
  const numState: number = val >= 0 ? 1 : -1;
  let num: number;
  if (numState === -1) {
    num = val * -1;
  } else {
    num = val;
  }
  if (state) {
    return numState;
  } else {
    return num;
  }
}
