import { shadowBuilder, lyl, StyleCollection, mergeThemes } from '@alyle/ui';
import { MinimaBase } from './base';
import { color, Color } from '@alyle/ui/color';
import { LyFieldTheme } from '@alyle/ui/field';
import { LyTooltipTheme } from '@alyle/ui/tooltip';
import { LySnackBarTheme } from '@alyle/ui/snack-bar';
import { Injectable } from '@angular/core';
import { LyMenuTheme } from '@alyle/ui/menu';
import { LySliderTheme } from '@alyle/ui/slider';

const contrast = new Color(0xffffff);
const shadow = new Color(0, 0, 0, 1);

@Injectable()
export class MinimaDark extends MinimaBase {
  name = 'minima-dark';
  primary = {
    default: color(0x1DE9B6),
    contrast: new Color(0, 0, 0, 0.87)
  };
  accent = {
    default: new Color(0x9C27B0),
    contrast
  };
  warn = {
    default: new Color(0xEA404C),
    contrast
  };
  disabled = {
    default: new Color(255, 255, 255, 0.3),
    contrast: new Color(255, 255, 255, 0.5)
  };
  action = {
    default: new Color(255, 255, 255, 0.70),
    contrast: new Color(0, 0, 0, 0.87)
  };
  background = {
    default: new Color(0x212121), // secondary
    primary: {
      default: new Color(0x303030),
      shadow
    },
    secondary: new Color(0x212121),
    tertiary: new Color(65, 65, 65),
  };
  paper = {
    default: new Color(0x303030),
    shadow
  };
  hover = new Color(255, 255, 255, 0.04);
  text = {
    default: new Color(0xffffff),
    primary: new Color(0xffffff),
    secondary: new Color(255, 255, 255, 0.70),
    disabled: new Color(255, 255, 255, 0.50),
    hint: new Color(255, 255, 255, 0.50),
    dark: new Color(0x2b2b2b),
    light: new Color(0xffffff)
  };
  drawer = {
    backdrop: new Color(49, 49, 49, .6)
  };
  bar = new Color(0x212121);
  divider = new Color(255, 255, 255, 0.12);
  colorShadow = shadow;
  shadow = shadow;
  field: LyFieldTheme = mergeThemes<LyFieldTheme, LyFieldTheme>(this.field, {
    root: new StyleCollection(
      _ => lyl `{
        ${_.container}:after, ${_.fieldset}, ${_.labelContainer} {
          border-color: ${new Color(255, 255, 255, 0.12)}
        }
        ${_.label}, ${_.placeholder} {
          color: ${new Color(255, 255, 255, 0.4)}
        }
      }`
    ),
    appearance: {
      filled: _ => lyl `{
        ${_.container} {
          background-color: ${new Color(255, 255, 255, 0.04)}
        }
      }`
    }
  });
  snackBar: LySnackBarTheme = {
    root: new StyleCollection(lyl `{
      background: ${new Color(0xfafafa)}
      color: ${new Color(0, 0, 0, .87)}
      box-shadow: ${shadowBuilder(4, new Color(0xfafafa))}
    }`)
  };
  tooltip: LyTooltipTheme = {
    root: new StyleCollection(() => lyl `{
      background: ${new Color(250, 250, 250, 0.85)}
      color: ${new Color(0, 0, 0, .87)}
    }`)
  };

  menu: LyMenuTheme = {
    root: new StyleCollection(
      __ => lyl `{
        ${__.item} ly-icon, ${__.itemSubMenuTrigger}:after {
          color: ${color(0xffffff)}
        }
      }`
    )
  };
  slider: LySliderTheme = mergeThemes<LySliderTheme, LySliderTheme>(this.slider, {
    appearance: {
      md: __ => lyl `{
        ${__.thumbLabel} {
          background-color: ${new Color(0xd5d5d5)} !important
          color: ${new Color(0, 0, 0, .87)} !important
        }
      }`
    }
  });
}
