import { InjectionToken } from '@angular/core';

export const THEME_CONFIG = new InjectionToken<ThemeConfig | ThemeConfig[]>('ly.theme.config.root');
export const LY_THEME_CONFIG = new InjectionToken<LyThemeConfig>('ly_theme_config');
export const LY_THEME_NAME = new InjectionToken<string>('ly.theme.name');

export interface ThemeConfig {
  name: string;
  primary: DefaultVal & PaletteColor;
  accent: DefaultVal & PaletteColor;
  warn: DefaultVal & PaletteColor;
  background: {
    /** secondary */
    default: string,
    primary: DefaultVal & PaletteColor,
    secondary: string,
    tertiary: string,
    base: string
  };
  text: {
    default: string,
    primary: string,
    secondary: string,
    disabled: string,
    hint: string
  };
  /** color for divider */
  divider: string;
  shadow: string;
  /** @deprecated use shadow instead */
  colorShadow?: string;
  button: {
    disabled: string;
  };
  radio: {
    /** color for radio:outerCircle */
    outerCircle?: string;
    /** @deprecated use outerCircle instead */
    radioOuterCircle?: string;
  };
  menu: {
    bg: string;
  };
  drawer: {
    /** color for drawer:backdrop */
    backdrop: string
  };
  input: {
    label: string,
    underline: string,
    /** default color */
    withColor: string
  };
  iconButton: {
    size: string;
  };
  icon: {
    fontSize: string;
  };
}



export type PartialThemeConfig = Partial<ThemeConfig>;

export class LyThemeConfig {
  themes: any[] = [];
  /** global variables */
  variables?: any;
}

export interface DefaultVal {
  default: string;
}
export interface PaletteColor {
  contrast?: string;
  /** shadow color */
  shadow?: string;
}
