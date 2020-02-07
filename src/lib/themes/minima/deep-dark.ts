import { ThemeConfig } from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { MinimaDark } from './dark';

const shadow = new Color(0, 0, 0, 1);
export class MinimaDeepDark extends MinimaDark implements ThemeConfig {
  name = 'minima-deep-dark';
  background = {
    default: new Color(24, 24, 24), // secondary
    primary: {
      default: new Color(16, 16, 16),
      shadow
    },
    secondary: new Color(24, 24, 24),
    tertiary: new Color(32, 32, 32),
  };
  paper = {
    default: new Color(16, 16, 16),
    shadow
  };
  // field: LyFieldTheme = mergeThemes<LyFieldTheme, LyFieldTheme>(this.field, {
  //   root: _ => (className: string) => ``,
  //   appearance: {
  //     filled: _ => (className: string) => ``
  //   }
  // });
}
