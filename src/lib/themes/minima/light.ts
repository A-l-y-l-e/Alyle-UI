import { ThemeConfig, mergeDeep, shadowBuilder } from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { MinimaBase } from './base';

const contrast = new Color(0xffffff);
const shadow = new Color(0x333333);
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
    base: new Color(0xE0E0E0)
  };
  hover = new Color(0, 0, 0, 0.04);
  paper = {
    default: new Color(0xffffff),
    shadow
  };
  disabled = {
    default: new Color(0, 0, 0, 0.27),
    contrast: new Color(0, 0, 0, 0.41)
  };
  text = {
    default: new Color(0, 0, 0, 0.87),
    primary: new Color(0, 0, 0, 0.87),
    secondary: new Color(0, 0, 0, 0.54),
    disabled: new Color(0, 0, 0, 0.26),
    hint: new Color(0, 0, 0, 0.38)
  };
  divider = new Color(0, 0, 0, 0.12);
  colorShadow = new Color(0x333333);
  shadow = new Color(0x333333);
  menu = {};
  drawer = {
    backdrop: new Color(0, 0, 0, .6)
  };
  bar = new Color(0xf5f5f5);
  field = mergeDeep({}, this.field, {
    borderColor: new Color(0, 0, 0, 0.23),
    labelColor: new Color(0, 0, 0, 0.6),
    appearance: {
      filled: {
        '{container}': {
          backgroundColor: new Color(0, 0, 0, 0.04),
        }
      }
    }
  });
  badge = {};
  snackBar = {
    root: {
      background: new Color(0x323232).css(),
      color: new Color(0xffffff).css(),
      boxShadow: shadowBuilder(4, new Color(0x323232).css())
    }
  };
  tooltip = {
    root: {
      background: new Color(50, 50, 50, 0.85).css(),
      color: new Color(0xffffff).css()
    }
  };
}
