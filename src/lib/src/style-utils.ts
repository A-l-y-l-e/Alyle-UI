export interface TypographyConfig {
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
  textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
  gutterTop?: number;
  gutterBottom?: number;
}

export class LyStyleUtils {
  typography: {
    fontFamily?: string;
    htmlFontSize: number,
    fontSize: number;
  };
  breakpoints: {
    XSmall: string,
    Small: string,
    Medium: string,
    Large: string,
    XLarge: string,

    Handset: string,
    Tablet: string,
    Web: string,

    HandsetPortrait: string,
    TabletPortrait: string,
    WebPortrait: string,

    HandsetLandscape: string,
    TabletLandscape: string,
    WebLandscape: string,
    [key: string]: string
  };
  direction?: Dir;
  pxToRem(value: number) {
    const size = this.typography.fontSize / 14;
    return `${value / this.typography.htmlFontSize * size}rem`;
  }
  colorOf(value: string, optional?: string): string {
    return get(this, value, optional);
  }
  getBreakpoint(key: string) {
    return `@media ${this.breakpoints[key] || key}`;
  }

  getDirection(val: Dir) {
    if (val === Dir.end) {
      return this.direction === 'rtl' ? 'left' : 'right';
    } else {
      return this.direction === 'rtl' ? 'right' : 'left';
    }
  }
}

export enum Dir {
  start = 'start',
  end = 'end',
  rtl = 'rtl',
  ltr = 'ltr',
  left = 'left',
  right = 'right'
}

/**
 * get color of object
 * @param obj object
 * @param path path
 * @param optional get optional value, if not exist return default if not is string
 */
function get(obj: Object, path: string[] | string, optional: string): string {
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    const posibleOb = obj[_path[i]];
    if (posibleOb) {
      obj = posibleOb;
    } else {
      /** if not exist */
      return path as string;
    }
  }
  if (typeof obj === 'string') {
    return obj as string;
  } else if (optional) {
    return obj[optional] || obj['default'];
  } else {
    return obj['default'];
  }
  // return typeof obj === 'string' ? obj as string : obj['default'] as string;
}

export function eachMedia(str: string | number, fn: ((val: string, media: string, isMedia: number) => void)) {
  if (typeof str === 'string') {
    const values = str.split(/\s/g);
    for (let index = 0; index < values.length; index++) {
      const valItem = values[index].split(/\@/g);
      const value = valItem.shift();
      const len = valItem.length;
      if (len) {
        for (let j = 0; j < len; j++) {
          fn.call(undefined, value, valItem[j], valItem.length);
        }
      } else {
        fn.call(undefined, value, undefined, len);
      }
    }
  } else {
    fn.call(undefined, str, undefined, 0);
  }
}
/**
 * Simple object check.
 * @param item
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep<T, U>(target: T, source: U): T & U;
export function mergeDeep<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function mergeDeep<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function mergeDeep(target: object, ...sources: any[]): any;

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) { return target; }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) { Object.assign(target, { [key]: {} }); }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
