export class Color {

  private readonly _color: number[];

  constructor(hex: number, alpha?: number)
  // tslint:disable-next-line: unified-signatures
  constructor(r: number, g: number, b: number, alpha?: number)
  constructor(...args: number[])
  constructor(...args: number[]) {
    if (args.length < 3) {
      this._color = bigIntToRgb(args[0], args[1]);
    } else {
      if (args.length === 3) {
        this._color = args;

      }
    }
  }

  alpha(value?: number) {
    if (value === void 0) {
      if (this._format === ColorFormat.Rgb && this._color.length === 4) {
        return this._color[3];
      }
    }
    return toColor(this._color);
  }
  private _alpha: number;

  luminance(value?: number) {
    return this;
  }
  private _luminance: number;

  saturate(value?: number) {
    return this;
  }
  private _saturate: number;

  darken(value?: number) {
    return this;
  }
  private _darken: number;

  css() {
    const color = this._color;
    return rgbToCss(this._color);
  }
}

function toColor(color: number | number[]) {
  if (typeof color === 'number') {
    return new Color(color);
  }
  return new Color(...color);
}

/**
 * Convert number to CSS
 * 0x00bcd4 > #00bcd4
 * @param int Int
 */
function bigIntToCss(int: number) {
  const hex = int.toString(16);
  return '#000000'.substring(0, 7 - hex.length) + hex;
}

function rgbToCss(rgb: [number, number, number, number]) {
  return `rgba(${rgb.join()})`;
}

function bigIntToRgb(bigInt: number, alpha = 1) {
  // tslint:disable-next-line: no-bitwise
  const red = (bigInt >> 16) & 255;
  // tslint:disable-next-line: no-bitwise
  const green = (bigInt >> 8) & 255;
  // tslint:disable-next-line: no-bitwise
  const blue = bigInt & 255;

  return [red, green, blue, alpha];
}

function rgbToBigInt(r: number, g: number, b: number) {
  // tslint:disable-next-line: no-bitwise
  return (r << 16) + (g << 8) + b;
}

export const color1 = new Color(0x00bcd4);
export const color2 = new Color(0x00bcd4);
export const color3 = new Color(0x00bcd4, .5);
export const color4 = new Color(250, 250, 250);
export const color5 = new Color(250, 250, 250, .5);
export const color6 = new Color(...[250, 250, 250, .5]);
