import { InjectionToken } from '@angular/core';

export const THEME_CONFIG = new InjectionToken<ThemeConfig | ThemeConfig[]>('ly.theme.config.root');
export const LY_THEME_CONFIG = new InjectionToken<LyThemeConfig>('ly_theme_config');
export const THEME_CONFIG_EXTRA = new InjectionToken<ThemeConfig | ThemeConfig[]>('ly.theme.config.extra');
export const LY_THEME_NAME = new InjectionToken<string>('ly.theme.name');

export interface ThemeConfig {
  name: string;
  primary: DefaultVal & PaletteColor;
  accent: DefaultVal & PaletteColor;
  warn: DefaultVal & PaletteColor;
  [key: string]: any;
}

export class LyThemeConfig {
  themes: any[] = [];
}

export interface DefaultVal {
  default: string;
}
export interface PaletteColor {
  contrast: string;
}
