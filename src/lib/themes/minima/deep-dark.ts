import { ThemeConfig } from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { MinimaDark } from './dark';
import { Injectable } from '@angular/core';

const shadow = new Color(0, 0, 0, 1);
@Injectable()
export class MinimaDeepDark extends MinimaDark implements ThemeConfig {
  name = 'minima-deep-dark';
  background = {
    default: new Color(0x121212), // secondary
    primary: {
      default: new Color(29, 29, 29),
      shadow
    },
    secondary: new Color(24, 24, 24),
    tertiary: new Color(32, 32, 32),
  };
  paper = {
    default: new Color(29, 29, 29),
    shadow
  };
}
