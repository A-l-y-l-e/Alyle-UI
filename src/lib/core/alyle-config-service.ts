import { InjectionToken } from '@angular/core';
import { StyleData } from './theme.service';

export const THEME_VARIABLES = new InjectionToken<PaletteVariables>('ly.theme.variables');
/** Deprecated */
export const CORE_THEME_VARIABLES = new InjectionToken<PaletteVariables>('ly.core.theme.variables');
export const IS_CORE_THEME = new InjectionToken<true>('ly.is.root');
export const PALETTE = new InjectionToken<PaletteVariables>('ly.palette');

export class StyleMap {
  private styleMap: Map<string, StyleData>;
  constructor(private themeName: string) {}
}


export class ThemeVariables {
  /** Theme name */
  name: string;
  primary?: PaletteVariables;
  accent?: PaletteVariables;
  /** warn or error color */
  warn?: PaletteVariables;
  scheme?: string;
  colorSchemes?: {
    [key: string]: ColorScheme
  };
  [key: string]: {
    [key: string]: any
  } | string;

}

export interface PaletteVariables {
  default?: string;
  contrast?: string;
  [key: string]: string;
}

export interface ColorScheme {
  background?: {
    default?: string,
    paper?: string
  };
  text?: {
    default: string,
    primary?: string,
    secondary?: string,
    disabled?: string,
    hint?: string
  };
  divider?: string;
  /** Components variables */
  colorShadow?: string;
  bar?: string;
  input?: {
    label?: string,
    underline?: string
  };
  [key: string]: {
    [key: string]: any
  } | any;
}
