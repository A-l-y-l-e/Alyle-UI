import { Color, hexColorToInt } from '@alyle/ui/color';
import { _STYLE_MAP, Styles, LyClasses } from './theme/style';
import { StyleCollection, StyleTemplate } from './parse';
import { memoize } from './minimal/memoize';

export class LyStyleUtils {
  name: string;
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
  direction: Dir | `${Dir}`;

  /** Returns left or right according to the direction */
  get before() {
    return this.getDirection(DirAlias.before);
  }

  /** Returns left or right according to the direction */
  get after() {
    return this.getDirection(DirAlias.after);
  }

  /** Returns top */
  readonly above = 'top';

  /** Returns bottom */
  readonly below = 'bottom';

  pxToRem(value: number) {
    const size = this.typography.fontSize / 14;
    return `${value / this.typography.htmlFontSize * size}rem`;
  }
  colorOf(value: string | number, optional?: string): Color {
    if (typeof value === 'number') {
      return new Color(value);
    }
    if (value[0] === '#' && value.length === 7) {
      return new Color(hexColorToInt(value));
    }
    const color = get(this, value, optional);
    if (color) {
      return color;
    }
    /** Create invalid color */
    return new Color();
  }
  getBreakpoint(key: string) {
    return `@media ${this.breakpoints[key] || key}`;
  }

  selectorsOf<T>(styles: T & Styles): LyClasses<T> {
    const styleMap = _STYLE_MAP.get(styles);
    if (styleMap) {
      return styleMap.classes || styleMap[this.name];
    } else {
      throw Error('Classes not found');
    }
  }

  getDirection(val: DirAlias | 'before' | 'after' | 'above' | 'below') {
    if (val === DirAlias.before) {
      return this.direction === 'rtl' ? 'right' : 'left';
    } else if (val === DirAlias.after) {
      return this.direction === 'rtl' ? 'left' : 'right';
    } else if (val === 'above') {
      return 'top';
    } else if (val === 'below') {
      return 'bottom';
    }
    return val;
  }

  isRTL() {
    return this.direction === Dir.rtl;
  }
}

export enum Dir {
  rtl = 'rtl',
  ltr = 'ltr'
}
export enum DirAlias {
  before = 'before',
  after = 'after'
}
export enum DirPosition {
  left = 'left',
  right = 'right'
}

/**
 * get color of object
 * @param obj object
 * @param path path
 * @param optional get optional value, if not exist return default if not is string
 */
function get(obj: Object, path: string[] | string, optional?: string): Color {
  if (path === 'transparent') {
    return new Color(0, 0, 0, 0);
  }
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    const posibleOb = obj[_path[i]];
    if (posibleOb) {
      obj = posibleOb;
    } else {
      /** if not exist */
      return new Color();
    }
  }
  if (obj instanceof Color) {
    return obj;
  } else if (optional) {
    return obj[optional] ?? obj['default'];
  } else {
    return obj['default'];
  }
  // return typeof obj === 'string' ? obj as string : obj['default'] as string;
}

export type MediaQueryArray = (string | number)[];

export type MediaQueryArrayDeprecated = (
  (number | string | [(string | number), string])
)[];

/**
 * Extract breakpoints from a string to make it a unique `StyleTemplate`
 * @param str Media Queries in inline style
 * @param transformer A function with parameters to create a `StyleTemplate`
 * @deprecated
 */
export function withMediaInline(
  str: string | number | MediaQueryArray,
  transformer: ((val: string | number, media: string | null) => StyleTemplate)
) {
  const styleCollection = new StyleCollection();
  if (typeof str === 'string') {
    const values = parseMediaQueriesFromString(str);
    for (let index = 0; index < values.length; index++) {
      parseMediaQueryFromString(values[index]).forEach((_) => {
        styleCollection.add(transformer(_[0], _[1]));
      });
    }
  } else if (typeof str === 'number' || str === null || str === undefined) {
    styleCollection.add(transformer(str as any, null));
  } else {
    for (let index = 0; index < str.length; index++) {
      const val = str[index];
      if (typeof val === 'number' || val === null || val === undefined) {
        styleCollection.add(transformer(val, null));
      } else if (typeof val === 'string') {
        parseMediaQueryFromString(val).forEach((_) => {
          styleCollection.add(transformer(_[0], _[1]));
        });
      }
    }
  }
  return styleCollection.css;
}

/**
 * Extract media query from a string
 */
export const parseMediaQueryFromString = memoize((key: string) => {
  const valItem = key.split(/\@/g);
  const strValue = valItem.shift()!;
  const len = valItem.length;
  const value = isNaN(+strValue) ? strValue : +strValue;
  const re: [string | number, string | null][] = [];
  if (len) {
    for (let j = 0; j < len; j++) {
      re.push([value, valItem[j]]);
    }
  } else {
    re.push([value, null]);
  }
  return re;
});

/**
 * Extract media queries from a string
 */
export const parseMediaQueriesFromString = memoize((key: string) => {
  return key.split(' ');
});

/**
 * @depracated use `withMediaInline` instead.
 */
export function eachMedia(
  str: string | number | MediaQueryArrayDeprecated,
  fn: ((val: string | number, media: string | null, index: number) => void)
): void;
/**
 * @depracated use `withMediaInline` instead.
 */
export function eachMedia(
  str: string | number | MediaQueryArrayDeprecated,
  fn: ((val: string | number, media: string | null, index: number) => StyleTemplate),
  styleCollection: boolean
): StyleTemplate;
/**
 * @depracated use `withMediaInline` instead.
 */
export function eachMedia(
  str: string | number | MediaQueryArrayDeprecated,
  fn: ((val: string | number, media: string | null, index: number) => (void | StyleTemplate)),
  withStyleCollection?: boolean
): StyleTemplate | void {
  let styleCollection: StyleCollection | undefined;
  if (withStyleCollection) {
    styleCollection = new StyleCollection();
  }
  if (typeof str === 'string') {
    const values = str.split(/\ /g);
    for (let index = 0; index < values.length; index++) {
      const valItem = values[index].split(/\@/g);
      const strValue = valItem.shift()!;
      const len = valItem.length;
      const value = isNaN(+strValue) ? strValue : +strValue;
      if (len) {
        for (let j = 0; j < len; j++) {
          resolveMediaEachItemStyle(fn, value, valItem[j], index, styleCollection);
        }
      } else {
        resolveMediaEachItemStyle(fn, value, null, index, styleCollection);
      }
    }
  } else if (typeof str === 'number' || typeof str === 'string' || str === null || str === undefined) {
    resolveMediaEachItemStyle(fn, str as any, null, 0, styleCollection);
  } else {
    // is array
    for (let index = 0; index < str.length; index++) {
      const val = str[index];
      if (typeof val === 'number' || typeof val === 'string') {
        resolveMediaEachItemStyle(fn, val, null, index, styleCollection);
      } else {
        const medias = val[1].split(/\@/g).filter(media => media);
        const strValue = val[0];
        const len = medias.length;
        if (len) {
          for (let ii = 0; ii < len; ii++) {
            resolveMediaEachItemStyle(fn, strValue, medias[ii], index, styleCollection);
          }
        } else {
          resolveMediaEachItemStyle(fn, strValue, null, index, styleCollection);
        }
      }

    }
  }
  if (styleCollection) {
    return styleCollection.css;
  }
}

function resolveMediaEachItemStyle(
  fn: (val: string | number, media: string | null, index: number) => void | StyleTemplate,
  val: string | number,
  media: string | null,
  index: number,
  styleCollection?: StyleCollection
) {
  const styl = fn(val, media, index);
  if (styleCollection && styl) {
    styleCollection.add(styl);
  }
}

/**
 * Simple object check.
 * @param item
 */
function isObject(item) {
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
export function mergeDeep(target: any, ...sources: any[]) {
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

/**
 * Simple object check.
 * @param item
 */
function isObjectForTheme(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item))
  && !(item instanceof StyleCollection)
  && !(item instanceof Color);
}

export function mergeThemes<T, U>(target: T, source: U): T & U;
export function mergeThemes<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function mergeThemes<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function mergeThemes(target: object, ...sources: any[]): any;
export function mergeThemes(target: any, ...sources: any[]): any {
  if (!sources.length) { return target; }
  const source = sources.shift();

  if (isObjectForTheme(target) && isObjectForTheme(source)) {
    for (const key in source) {
      if (isObjectForTheme(source[key])) {
        if (!target[key]) { Object.assign(target, { [key]: {} }); }
        mergeThemes(target[key], source[key]);
      } else {
        const targetKey = target[key];
        const sourceKey = source[key];
        // Merge styles
        if (targetKey instanceof StyleCollection && typeof sourceKey === 'function') {
          target[key] = (target[key] as StyleCollection).add(sourceKey);
        } else if (sourceKey instanceof Color) {
          target[key] = sourceKey;
        } else {
          // Object.assign(target, { [key]: source[key] });
          target[key] = source[key];
        }
      }
    }
  }

  return mergeThemes(target, ...sources);
}
