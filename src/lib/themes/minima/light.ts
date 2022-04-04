import { ThemeConfig, shadowBuilder, lyl, StyleCollection, mergeThemes } from '@alyle/ui';
import { Color, color } from '@alyle/ui/color';
import { MinimaBase } from './base';
import { LyFieldTheme } from '@alyle/ui/field';
import { LyTooltipTheme } from '@alyle/ui/tooltip';
import { LySnackBarTheme } from '@alyle/ui/snack-bar';
import { LyMenuTheme } from '@alyle/ui/menu';
import { Injectable } from '@angular/core';
import { LySliderTheme } from '@alyle/ui/slider';

const contrast = new Color(0xffffff);
const shadow = new Color(0x333333);
@Injectable()
export class MinimaLight extends MinimaBase implements ThemeConfig {
  name = 'minima-light';
  primary = {
    default: new Color(0x6200EE),
    contrast
  };
  accent = {
    default: new Color(0xFF2997),
    contrast,
  };
  warn = {
    default: new Color(0xf5414e),
    contrast
  };
  action = {
    default: new Color(0, 0, 0, .6),
    contrast: new Color(0xffffff)
  };
  background = {
    default: new Color(0xfafafa), // secondary
    primary: {
      default: new Color(0xffffff),
      shadow
    },
    secondary: new Color(0xfafafa),
    tertiary: new Color(0xefefef),
  };
  hover = new Color(0, 0, 0, 0.04);
  paper = {
    default: new Color(0xffffff),
    shadow
  };
  disabled = {
    default: new Color(0, 0, 0, 0.12),
    contrast: new Color(0, 0, 0, 0.26)
  };
  text = {
    default: new Color(0, 0, 0, 0.87),
    primary: new Color(0, 0, 0, 0.87),
    secondary: new Color(0, 0, 0, 0.54),
    disabled: new Color(0, 0, 0, 0.26),
    hint: new Color(0, 0, 0, 0.38),
    dark: new Color(0, 0, 0, 0.87),
    light: new Color(0xffffff)
  };
  divider = new Color(0, 0, 0, 0.12);
  colorShadow = new Color(0x333333);
  shadow = new Color(0x333333);
  drawer = {
    backdrop: new Color(0, 0, 0, .6)
  };
  bar = new Color(0xf5f5f5);
  field: LyFieldTheme = mergeThemes<LyFieldTheme, LyFieldTheme>(this.field, {
    root: new StyleCollection(({
      container,
      fieldset,
      labelContainer,
      placeholder,
      label}) => lyl `{
      ${container}:after, ${fieldset}, ${labelContainer} {
        border-color: ${new Color(0, 0, 0, 0.23)}
      }
      ${label}, ${placeholder} {
        color: ${new Color(0, 0, 0, 0.6)}
      }
    }`),
    appearance: {
      filled: ({ container }) => lyl `{
        ${container} {
          background-color: ${new Color(0, 0, 0, 0.04)}
        }
      }`
    }
  });
  snackBar: LySnackBarTheme = {
    root: new StyleCollection(lyl `{
      background: ${new Color(0x323232)}
      color: ${new Color(0xffffff)}
      box-shadow: ${shadowBuilder(4, new Color(0x323232))}
    }`)
  };
  tooltip: LyTooltipTheme = {
    root: new StyleCollection(() => lyl `{
      background: ${new Color(50, 50, 50, 0.85)}
      color: ${new Color(0xffffff)}
    }`)
  };

  menu: LyMenuTheme = {
    root: new StyleCollection(
      __ => lyl `{
        ${__.item} ly-icon, ${__.itemSubMenuTrigger}:after {
          color: ${color(0, 0, 0, 0.54)}
        }
      }`
    )
  };

  slider: LySliderTheme = mergeThemes<LySliderTheme, LySliderTheme>(this.slider, {
    appearance: {
      md: __ => lyl `{
        ${__.thumbLabel} {
          background-color: ${new Color(0x515151)} !important
          color: ${new Color(0xffffff)} !important
        }
      }`
    }
  });
}
