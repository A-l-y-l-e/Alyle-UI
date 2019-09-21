import { InjectionToken } from '@angular/core';
import { LyStyleUtils, Dir } from '../style-utils';
import { RippleVariables } from './variables/ripple';
import { TypographyVariables } from './variables/typography';
import { CheckboxVariables } from './variables/checkbox';
import { SnackBarVariables } from './variables/snack-bar';
import { ButtonVariables } from './variables/button';
import { TooltipVariables } from './variables/tooltip';
import { CardVariables } from './variables/card';
import { CarouselVariables } from './variables/carousel';
import { MenuVariables } from './variables/menu';
import { RadioVariables } from './variables/radio';
import { ImgCropperVariables } from './variables/img-cropper';
import { SelectVariables } from './variables/select';
import { TabsVariables } from './variables/tabs';
import { FieldVariables } from './variables/field';
import { DialogVariables } from './variables/dialog';
import { ListVariables } from './variables/list';
import { ToolbarVariables } from './variables/toolbar';

export const LY_THEME_GLOBAL_VARIABLES = new InjectionToken<PartialThemeVariables>('ly.theme.global.variables');
export const LY_THEME = new InjectionToken<ThemeConfig | ThemeConfig[]>('ly_theme_config');
export const LY_THEME_NAME = new InjectionToken<string>('ly.theme.name');

export interface ThemeConfig {
  name: string;
  primary: DefaultVal & PaletteColor;
  accent: DefaultVal & PaletteColor;
  warn: DefaultVal & PaletteColor;
  disabled: {
    default: string
    contrast: string
  };
  paper: DefaultVal & PaletteColor;
  background: {
    /** secondary */
    default: string,
    primary: DefaultVal & PaletteColor,
    secondary: string,
    tertiary: string,
    base: string
  };
  hover: string;
  text: {
    default: string,
    primary: string,
    secondary: string,
    disabled: string,
    hint: string
  };
  typography?: TypographyVariables;
  /** color for divider */
  divider: string;
  shadow: string;
  radio?: RadioVariables;
  menu?: MenuVariables;
  drawer: {
    /** color for drawer:backdrop */
    backdrop: string
  };
  field?: FieldVariables;
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
  direction?: Dir;
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
  ripple: RippleVariables;
  checkbox?: CheckboxVariables;
  snackBar?: SnackBarVariables;
  button?: ButtonVariables;
  tooltip: TooltipVariables;
  card?: CardVariables;
  carousel?: CarouselVariables;
  imgCropper?: ImgCropperVariables;
  select?: SelectVariables;
  tabs?: TabsVariables;
  dialog?: DialogVariables;
  list?: ListVariables;
  toolbar?: ToolbarVariables;
}

export type ThemeVariables = LyStyleUtils & ThemeConfig;
export type PartialThemeVariables = RecursivePartial<ThemeVariables>;

export interface DefaultVal {
  default: string;
}
export interface PaletteColor {
  contrast?: string;
  /** shadow color */
  shadow?: string;
}

type primitive = string | number | boolean | undefined | null;
type RecursivePartialObject<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export type RecursivePartial<T> = T extends primitive ? T : RecursivePartialObject<T>;

