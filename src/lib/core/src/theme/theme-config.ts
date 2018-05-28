import { InjectionToken } from '@angular/core';

export const THEME_CONFIG = new InjectionToken<ThemeConfig | ThemeConfig[]>('ly-theme-config');

export interface ThemeConfig {
  name: string;
  primary: DefaultVal & PaletteColor;
  accent: DefaultVal & PaletteColor;
  warn: DefaultVal & PaletteColor;
  [key: string]: any;
}

export interface DefaultVal {
  default: string;
}
export interface PaletteColor {
  contrast: string;
}
