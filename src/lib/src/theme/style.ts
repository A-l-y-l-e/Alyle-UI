/** Only for internal use */
export const _STYLE_MAP: Map<any, StyleMap5> = new Map();

/**
 * Only for internal use
 * @docs-private
 */
export interface StyleMap5 {
  styles: Styles;
  type: TypeStyle;
  priority?: number | null;
  css: {
    [themeName: string]: string
  } | string;
  /** global theme */
  classes?: {
    [key: string]: string
  } | string;
  /** requireUpdate */
  classesWithTheme?: {
    [themeName: string]: {
      [key: string]: string
    } | string
  };
  /** Only for styles of TypeStyle.one */
  parentStyle?: Styles;
  requireUpdate?: boolean;
  id: string | null;
}

export enum TypeStyle {
  Multiple,
  OnlyOne
}


/**
 * Style Object
 */
export interface StyleContainer {
  [key: string]: StyleContainer | string | number | string[] | null | undefined;
}

export interface StyleGroup {
  /** Prefix name */
  $name?: string;
  $keyframes?: Keyframes;
  $priority?: number;
  [key: string]: StyleContainer | string | number | undefined | null;
}

/**
 * CSS declarations block
 */
export type StyleDeclarationsBlock = ((T: any) => StyleContainer | string) | StyleContainer | string | null | undefined;

export type Styles = ((T: any, theme: any) => StyleGroup) | StyleGroup | undefined | null;

export interface Keyframes {
  [name: string]: {
    [percent: number]: StyleContainer
  };
}

// Convert all properties to `string` type, and exclude properties that not is class name
export type LyClasses<T> = Record<(
  Exclude<(T extends ((...args: any[]) => any) ? (keyof ReturnType<T>) : keyof T),
  '$name' | '$keyframes' | '@global' | '$priority'>
), string>;

