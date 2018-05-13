/**
 * Color tranformation
 */

function getHexValue( intInput: any ) {
  let result = intInput.toString(16);
  if ( result.length < 2 ) {
    result = '0' + result;
  }
  return result;
}
export function Color( red: number, green: number, blue: number, alpha?: number ) {
  return {
    red: red,
    green: green,
    blue: blue,
    alpha: alpha,
    toHex: () => {
      return getHexValue(red) + getHexValue(green) + getHexValue(blue);
    }
  };
}

// Converter which actually does the calculation from rgba to hex.
const colorConverter = {

  // Converts the given color to a Color object, using the given gbColor in the calculation.
  convertToHex: function( color: any, bgColor: any ) {
    const alpha = color.alpha;

    function getTintValue(tint: number, bgTint: number) {
      const tmp = Math.floor((1 - alpha ) * bgTint + alpha * tint);
      if ( tmp > 255 ) {
        return 255;
      }
      return tmp;
    }

    return Color(
      getTintValue( color.red, bgColor.red ),
      getTintValue( color.green, bgColor.green ),
      getTintValue( color.blue, bgColor.blue )
    );
  }
};
function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) {t += 1; }
  if (t > 1) {t -= 1; }
  if (t < 1 / 6) {return p + (q - p) * 6 * t; }
  if (t < 1 / 2) {return q; }
  if (t < 2 / 3) {return p + (q - p) * (2 / 3 - t) * 6; }
  return p;
}

const colorStringParser = {

  // Converter for rgb(a) colors
  rgba: function( rgba: any ) {
    // Strip the rgba-definition off the string.
    rgba = rgba.replace('rgba(', '')
    .replace(')', '')
    .replace(' ', '');

    // Split the rgba string into an array.
    const splittedRgba = rgba.split(',');

    return Color(
      parseInt( splittedRgba[0], 10 ),
      parseInt( splittedRgba[1], 10 ),
      parseInt( splittedRgba[2], 10 ),
      parseFloat( splittedRgba[3] ) || 1
    );
  },

  // Converter for hex colors
  hex: function( hexString: any ) {
    hexString = hexString.replace('#', '');
    let rgbArr = [], hexPair;

    function getHexPartByIndex( index: number ) {
      switch ( hexString.length ) {
        case 3:
        return hexString[index] + hexString[index];
        default:
        index *= 2;
        return hexString[index] + hexString[index + 1];
      }
    }

    // String the "#" off the hex-string.
    hexString = hexString.replace('#', '');

    // Convert pairs of hex-characters into decimal numbers.
    for (let i = 0; i < hexString.length; i++) {
      rgbArr.push( parseInt(getHexPartByIndex( i ), 16) );
    }

    return Color(rgbArr[0], rgbArr[1], rgbArr[2], 1);
  },

  // Converter for hsl(a) colors.
  hsla: function hslToRgb(hsla: any) {
    hsla = hsla.replace('hsla(', '')
    .replace('hsl(', '')
    .replace(')', '')
    .replace(' ', '');
    // Split the hsla string into an array.
    hsla = hsla.split(',');

    const h = parseInt(hsla[0], 10) / 360;
    const s = parseInt(hsla[1], 10) / 100;
    const l = parseInt(hsla[2], 10) / 100;
    const a = parseFloat(hsla[3]) || 1;

    let r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a );
  }

};


// Returns the type of color based on the given string.
function getColorType( colorString: string ) {
  if ( colorString.indexOf('rgba') !== -1 || colorString.indexOf('rgb') !== -1 ) {
    return 'rgba';
  }
  if ( colorString.indexOf('hsla') !== -1 || colorString.indexOf('hsl') !== -1 ) {
    return 'hsla';
  }
  return 'hex';
}

// Convenience function that returns the Color object for the given inputString.
function getColorForString( inputString: string ) {
  return colorStringParser[ getColorType( inputString ) ]( inputString );
}


export function trim (str: string) {
  return str.replace(/^\s+|\s+$/gm, '');
}

export function rgbaToHex(rgba: string) {
  const parts = rgba.substring(rgba.indexOf('(')).split(','),
  r = parseInt(trim(parts[0].substring(1)), 10),
  g = parseInt(trim(parts[1]), 10),
  b = parseInt(trim(parts[2]), 10),
  a = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);

  return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (Number(a) * 255).toString(16).substring(0, 2));
}
export function componentToHex(c: any) {
  c = Number(c);
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}
// for shadow
export function toRgb(str: string, alpha?: number) {
  return hexToRgba(colorConverter.convertToHex(getColorForString(str), getColorForString('#ffffff')).toHex(), alpha || 1);
}

export function converterToHex(str: string) {
  return colorConverter.convertToHex(getColorForString(str), getColorForString('#ffffff')).toHex();
}
export function rgbToHex(rgb: string) {
  let toRgb: any = rgb;

  if (toRgb.substr(0, 4) === 'rgba') {
    toRgb = toRgb.slice(5);
  } else {
    toRgb = toRgb.slice(4);
  }
  toRgb = toRgb.slice(0, -1);
  toRgb = toRgb.replace(' ', '');
  toRgb = toRgb.split(',');
  return componentToHex(toRgb[0]) + componentToHex(toRgb[1]) + componentToHex(toRgb[2]);
}
export function rgbTransparent(rgba: any): number {
  if (typeof rgba === 'string') {
    rgba = rgba.slice(0, -1);
    rgba = (rgba.split(',')[3]) * 1;
    if (typeof rgba === 'number') {
      rgba = 1;
    }
  } else {
    rgba = 1;
  }
  return rgba;
}

export function hexToRgba(hex: string, tr: number = -1) {
  const _default = hex;
  const transparent = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  };
  if (tr === -1) {
    tr = rgbTransparent(hex);
  }
  hex = String(hex);
  if ((hex.substr(0, 4) === 'rgba') && !!hex.split(',')[3]) {
    tr = parseFloat(hex.split(',')[3].replace(')', ''));
    hex = String(hex);
    if (hex.length !== 6 && hex.length !== 3) {
      hex = rgbToHex(hex);
    }
  }
  if (hex !== undefined && hex !== null && hex !== 'transparent') {

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m: any, r: any, g: any, b: any) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let colorr = 0;
    let colorg = 0;
    let colorb = 0;
    if (result) {
      colorr = parseInt(result[1], 16);
      colorg = parseInt(result[2], 16);
      colorb = parseInt(result[3], 16);
    }
    return result ? {
      json: {
        r: colorr,
        g: colorg,
        b: colorb,
        a: tr
      },
      color: `rgba(${colorr}, ${colorg}, ${colorb}, ${tr})`,
    } : {
      json: transparent,
      color: `${_default}`,
    };
  } else {
    return {
      json: transparent,
      color: `rgba(${0}, ${0}, ${0}, ${0})`,
    };
  }
}
