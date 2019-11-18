const EPS = 1e-7;
const MAX_ITER = 20;
const { pow, min, max } = Math;

export class Color {

  private readonly _color: number[];

  constructor(hex: number, alpha?: number)
  // tslint:disable-next-line: unified-signatures
  constructor(r: number, g: number, b: number, alpha?: number)
  constructor(...args: number[])
  constructor(...args: number[]) {
    if (args.length < 3 && args.length > 0) {
      this._color = bigIntToRgb(args[0], args[1]);
    } else if (args.length > 2) {
      this._color = args;

      // Set default alpha
      if (args.length === 3) {
        this._color[3] = 1;
      }
    } else {
      this._color = [];
    }
  }

  rgb() {
    return this._color.slice(0);
  }

  alpha(): number;
  alpha(value: number): Color;
  alpha(value?: number) {
    if (value === void 0) {
      return this._color[3];
    }

    // Clone
    const color = this._color.slice(0);

    // Set alpha
    color[3] = value;
    return new Color(...color);
  }

  luminance(): number;
  luminance(lum: number): Color;
  luminance(lum?: number) {
    if (lum === void 0) {
      return rgbToLuminance(...(this._color as [number, number, number]));
    }

    if (lum === 0) {
      // return pure black
      return new Color(0, 0, 0, this._color[3]);
    }
    if (lum === 1) {
      // return pure white
      return new Color(255, 255, 255, this._color[3]);
    }

    const relativeLuminance = this.luminance();
    let max_iter = MAX_ITER;

    const test = (low: Color, high: Color): Color => {
      const mid = new Color(...interpolateRgb(low.rgb(), high.rgb(), 0.5));
      const lm = mid.luminance() as number;

      if (Math.abs(lum - lm) < EPS || !max_iter--) {
        return mid;
      }

      return lm > lum ? test(low, mid) : test(mid, high);
    };

    const rgb = (relativeLuminance > lum
        ? test(new Color(0, 0, 0), this)
        : test(this, new Color(255, 255, 255))).rgb();
    rgb.pop();
    rgb.push(this._color[ 3 ]);

    return new Color(...rgb);

  }

  saturate(amount = 1) {
    const lab = rgbToLab(this._color);
    const lch = labToLch(lab);

    lch[1] += 18 * amount;

    if (lch[1] < 0) {
      lch[1] = 0;
    }

    const labFromLch = lchToLab(lch);
    const xyzFromLab = labToXyz(labFromLch);
    const rgb = xyzToRgb(xyzFromLab);

    // Set alpha
    rgb.push(this._color[3]);

    return new Color(...rgb);
  }

  desaturate(amount = 1) {
    return this.saturate(-amount);
  }

  darken(amount = 1) {
    const lab = rgbToLab(this._color);
    lab[0] -= 18 * amount;
    const xyzFromLab = labToXyz(lab);
    const rgb = xyzToRgb(xyzFromLab);

    // Set alpha
    rgb.push(this._color[3]);

    return new Color(...rgb);
  }

  brighten(amount = 1) {
    return this.darken(-amount);
  }

  css() {
    if (!this._color.length) {
      return 'undefined - invalid color';
    }
    return rgbToCss(this._color as [number, number, number, number]);
  }

  toString() {
    return this.css();
  }

}


// /**
//  * Convert number to CSS
//  * 0x00bcd4 > #00bcd4
//  * @param int Int
//  */
// function bigIntToCss(int: number) {
//   const hex = int.toString(16);
//   return '#000000'.substring(0, 7 - hex.length) + hex;
// }

function rgbToCss(rgb: [number, number, number, number]) {
  return `rgba(${rgb.join()})`;
}

function bigIntToRgb(bigInt: number, alpha = 1) {
  // if (bigInt < 0x1000) {
  //   bigInt = parseInt(bigInt.toString(16).split('').map(char => {
  //     return char + char;
  //   }).join(''), 16);
  // }
  // tslint:disable-next-line: no-bitwise
  const red = (bigInt >> 16) & 0xff;
  // tslint:disable-next-line: no-bitwise
  const green = (bigInt >> 8) & 0xff;
  // tslint:disable-next-line: no-bitwise
  const blue = bigInt & 0xff;

  return [red, green, blue, alpha];
}

// function rgbToBigInt(r: number, g: number, b: number) {
//   // tslint:disable-next-line: no-bitwise
//   return (r << 16) + (g << 8) + b;
// }

function rgbToXyz(rgb: number[]) {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;

  // Assume sRGB
  r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
  g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
  b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

  const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y * 100, z * 100];
}

function rgbToLab(rgb: number[]) {
  const xyz = rgbToXyz(rgb);
  let x = xyz[ 0 ];
  let y = xyz[ 1 ];
  let z = xyz[ 2 ];

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return [ l, a, b ];
}

function labToLch(lab: number[]) {
  const l = lab[ 0 ];
  const a = lab[ 1 ];
  const b = lab[ 2 ];
  let h: number;

  const hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;

  if (h < 0) {
    h += 360;
  }

  const c = Math.sqrt(a * a + b * b);

  return [ l, c, h ];
}

function lchToLab(lch: number[]) {
  const l = lch[ 0 ];
  const c = lch[ 1 ];
  const h = lch[ 2 ];

  const hr = h / 360 * 2 * Math.PI;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  return [ l, a, b ];
}

function labToXyz(lab: number[]) {
  const l = lab[ 0 ];
  const a = lab[ 1 ];
  const b = lab[ 2 ];
  let x;
  let y;
  let z;

  y = (l + 16) / 116;
  x = a / 500 + y;
  z = y - b / 200;

  const y2 = y ** 3;
  const x2 = x ** 3;
  const z2 = z ** 3;
  y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
  x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
  z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

  x *= 95.047;
  y *= 100;
  z *= 108.883;

  return [ x, y, z ];
}

function xyzToRgb(xyz: number[]) {
  const x = xyz[ 0 ] / 100;
  const y = xyz[ 1 ] / 100;
  const z = xyz[ 2 ] / 100;
  let r;
  let g;
  let b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // Assume sRGB
  r = r > 0.0031308
    ? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
    : r * 12.92;

  g = g > 0.0031308
    ? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
    : g * 12.92;

  b = b > 0.0031308
    ? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
    : b * 12.92;

  r = min(max(0, r), 1);
  g = min(max(0, g), 1);
  b = min(max(0, b), 1);

  return [ r * 255, g * 255, b * 255 ];
}

function rgbToLuminance(r: number, g: number, b: number) {
  // Relative luminance
  // See http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  r = luminance_channel(r);
  g = luminance_channel(g);
  b = luminance_channel(b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function luminance_channel(x: number) {
  x /= 255;
  return x <= 0.03928 ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4);
}

function interpolateRgb(rgb1: number[], rgb2: number[], f = 0.5) {

  return [
    rgb1[ 0 ] + f * (rgb2[ 0 ] - rgb1[ 0 ]),
    rgb1[ 1 ] + f * (rgb2[ 1 ] - rgb1[ 1 ]),
    rgb1[ 2 ] + f * (rgb2[ 2 ] - rgb1[ 2 ]),
  ];
}

export function hexColorToInt(color: string) {
  if (color.startsWith('#')) {
    return parseInt(color.slice(1), 16);
  }
  throw new Error(`Expected to start with '#' the given value is: ${color}`);
}

// export const color1 = new Color(0x00bcd4).alpha();
// export const colorr = new Color(0x00bcd4).alpha(1);
// export const color2 = new Color(0x00bcd4);
// export const color3 = new Color(0x00bcd4, .5);
// export const color4 = new Color(250, 250, 250);
// export const color5 = new Color(250, 250, 250, .5);
// export const color6 = new Color(...[250, 250, 250, .5]);
// console.log(new Color(0x2b2b2b).luminance());

// console.log(Color);
