import { InjectionToken } from '@angular/core';

export class ThemeVariables {
  name?: string;
  primary: string;
  accent: string;
  other?: string;
  colorScheme?: 'light' | 'dark';
  variables?: {
    /** Others */
    [key: string]: {
      [key: string]: any // ...
    } | any
  };
  schemes?: {
    light: {
      colorText?: string;
      disabled?: string;
      bgText?: string;
      main?: string;
      [key: string]: {
        [key: string]: any
      } | any;
    },
    dark: {
      colorText?: string;
      disabled?: string;
      bgText?: string;
      main?: string;
      [key: string]: {
        [key: string]: any
      } | any;
    }
  };

}
export const PALETTE = new InjectionToken<PaletteVariables>('ly.palette');

export interface PaletteVariables {
  [key: string]: {
    default: string;
    contrastText: string;
    [key: string]: string;
  };
}
