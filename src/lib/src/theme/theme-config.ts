import { InjectionToken } from '@angular/core';
import { LyStyleUtils } from '../style-utils';
import { StyleContainer } from './theme2.service';

export const LY_THEME_GLOBAL_VARIABLES = new InjectionToken<PartialThemeVariables>('ly.theme.global.variables');
export const LY_THEME = new InjectionToken<ThemeConfig | ThemeConfig[]>('ly_theme_config');
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
  typography: {
    htmlFontSize: number,
    fontSize: number;
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
    /** @deprecated */
    label?: string
    /** @deprecated */
    underline?: string
    /** @deprecated */
    withColor?: string
    borderColor: string
    appearance: {
      [appearanceName: string]: {
        containerLabel?: StyleContainer
        containerLabelFocused?: StyleContainer
        containerLabelHover?: StyleContainer
        label?: StyleContainer
        placeholder?: StyleContainer
        input?: StyleContainer
        labelFloating?: StyleContainer
        containerLabelStart?: StyleContainer
        containerLabelCenter?: StyleContainer
        containerLabelCenterFloating?: StyleContainer
        containerLabelEnd?: StyleContainer
        container?: StyleContainer
      }
    }
  };
  iconButton: {
    size: string
  };
  icon: {
    fontSize: string
  };
  zIndex: {
    toolbar: number
    drawer: number
    overlay: number
    [key: string]: number
  };
  direction?: 'ltr' | 'rtl';
  animations: {
    curves: {
      standard: string
      deceleration: string
      acceleration: string
      sharp: string
    },
    durations: {
      complex: number
      entering: number
      exiting: number
    }
  };
  ripple: IRippleVariables;
}

export type ThemeVariables = LyStyleUtils & ThemeConfig;
export type PartialThemeVariables = Partial<ThemeVariables>;

export interface DefaultVal {
  default: string;
}
export interface PaletteColor {
  contrast?: string;
  /** shadow color */
  shadow?: string;
}

export interface IRippleVariables {
  transition: {
    opacity: string
    transform: string
  };
  duration: number;
}
