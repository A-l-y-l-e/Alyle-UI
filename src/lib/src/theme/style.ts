import { ThemeVariables } from './theme-config';
import { StyleTemplate } from '../parse';
import { Color } from '@alyle/ui/color';
import { memoize } from '../minimal/memoize';

/**
 * For internal use only
 * @docsPrivate
 */
export const _STYLE_MAP: Map<any, StyleMap5> = new Map();

/**
 * For internal use only
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
  isNewStyle?: boolean;
  /** This is used when a instance contains multiple styles */
  keys?: string[];
}

export enum TypeStyle {
  Multiple,
  OnlyOne,
  /**
   * A lyl Style
   */
  LylStyle
}


/**
 * Style Object
 */
export interface StyleContainer {
  [key: string]: StyleContainer | string | number | string[] | null | undefined | StyleTemplate | Color;
}

export interface StyleGroup {
  /** Prefix name */
  $name?: string;
  $keyframes?: KeyframesDeprecated;
  $priority?: number;
  [key: string]: StyleContainer | (() => StyleTemplate) | StyleTemplate | string | number | undefined | null;
}

export interface LyStyleGroup {
  /** Prefix name */
  $name?: string;
  $priority?: number;
  [key: string]: (() => (StyleTemplate | null | undefined)) | StyleTemplate | string | number | undefined | null;
}

/**
 * CSS declarations block
 */
export type StyleDeclarationsBlock = ((T: any, theme: any) => StyleContainer | string) | StyleContainer | string | null | undefined;

export type LyStyles = ((T: any, theme: any, selectors: any) => LyStyleGroup) | undefined | null;
export type Styles = (((T: any, theme: any) => StyleGroup) | StyleGroup | undefined | null) | LyStyles;

export interface KeyframesDeprecated {
  [name: string]: {
    [percent: number]: StyleContainer
  };
}

type LyClassesProperties<T> = {
  [
    P in keyof (
      T extends ((theme: any, ref?: any, selectors?: any) => infer R) ? R : T
    )
  ]: string;
};

// Convert all properties to `string` type, and exclude properties that not is class name
export type LyClasses<T> = Omit<LyClassesProperties<T>, '$name' | '$keyframes' | '@global' | '$priority' | '$global'>;
export type LySelectors<T> = {
  [P in keyof LyClasses<T>]: `.${string}`
};

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type LyComponentStyleItem<COMPONENT, INPUTS extends keyof COMPONENT> = {
  [P in INPUTS]: (theme: ThemeVariables, value: COMPONENT[P]) => StyleContainer
};

export interface LyComponentStyle<COMPONENT, INPUTS extends keyof COMPONENT> {
  [key: string]: LyComponentStyleItem<COMPONENT, INPUTS>;
}

export const getThemeNameForSelectors = memoize((themeId: string) => {
  return `${themeId}<~(selectors)`;
});

export type SelectorsFn = <T>(styles: T) => LySelectors<T>;

