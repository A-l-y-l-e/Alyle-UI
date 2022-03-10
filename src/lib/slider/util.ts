export function гbetween(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

export function гvalueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min);
}
