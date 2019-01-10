import { InjectionToken } from '@angular/core';

export const THEME_VARIABLES = new InjectionToken<PaletteVariables>('ly.theme.variables');
export const IS_CORE_THEME = new InjectionToken<true>('ly.is.root');

export interface Default {
  [key: string]: any;
}

export interface PaletteVariables {
  default?: string;
  contrast?: string;
  [key: string]: string | undefined;
}

export interface ColorScheme {
  background?: {
    default?: string,
    paper?: string,
    [key: string]: any;
  };
  text?: {
    default: string,
    primary?: string,
    secondary?: string,
    disabled?: string,
    hint?: string,
    [key: string]: any;
  };
  divider?: string;
  /** Components variables */
  colorShadow?: string;
  bar?: string;
  input?: {
    label?: string,
    underline?: string
  };
  [key: string]: any;
}
