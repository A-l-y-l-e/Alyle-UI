import { ThemeVariables } from './theme-config';
import { StyleTemplate } from '../parse';

/** For internal use only */
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
  [key: string]: StyleContainer | string | number | string[] | null | undefined | StyleTemplate;
}

export interface StyleGroup {
  /** Prefix name */
  $name?: string;
  $keyframes?: Keyframes;
  $priority?: number;
  [key: string]: StyleContainer | (() => StyleTemplate) | StyleTemplate | string | number | undefined | null;
}

/**
 * CSS declarations block
 */
export type StyleDeclarationsBlock = ((T: any, theme: any) => StyleContainer | string) | StyleContainer | string | null | undefined;

export type Styles = ((T: any, theme: any) => StyleGroup) | StyleGroup | undefined | null;

export interface Keyframes {
  [name: string]: {
    [percent: number]: StyleContainer
  };
}

// Convert all properties to `string` type, and exclude properties that not is class name
export type LyClasses<T> = {
  [
    P in Exclude<keyof (
      T extends (...args: any[]) => infer R ? R: T
    ), '$name' | '$keyframes' | '@global' | '$priority' | '$global'>
  ]: string;
};


type LyComponentStyleItem<COMPONENT, INPUTS extends keyof COMPONENT> = {
  [P in INPUTS]: (theme: ThemeVariables, value: COMPONENT[P]) => StyleContainer
};

export interface LyComponentStyle<COMPONENT, INPUTS extends keyof COMPONENT> {
  [key: string]: LyComponentStyleItem<COMPONENT, INPUTS>;
}

export function getThemeNameForSelectors(themeId: string) {
  return `${themeId}<~(selectors)`;
}
