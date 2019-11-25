import { ThemeConfig } from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { MinimaDark } from './dark';

const shadow = new Color(0, 0, 0, 1);
export class MinimaDeepDark extends MinimaDark implements ThemeConfig {
  name = 'minima-deep-dark';
  background = {
    default: new Color(0x161616), // secondary
    primary: {
      default: new Color(0x101010),
      shadow
    },
    secondary: new Color(0x161616),
    tertiary: new Color(0x1b1b1b),
  };
  paper = {
    default: new Color(0x101010),
    shadow
  };
  // field: LyFieldTheme = mergeThemes<LyFieldTheme, LyFieldTheme>(this.field, {
  //   root: _ => lyl `{
  //     ${_.container}:after, ${_.fieldset}, ${_.labelContainer} {
  //       border-color: ${new Color(255, 255, 255, 0.12)}
  //     }
  //     ${_.label}, ${_.placeholder} {
  //       color: ${new Color(255, 255, 255, 0.4)}
  //     }
  //   }`,
  //   appearance: {
  //     filled: _ => lyl `{
  //       ${_.container} {
  //         background-color: ${new Color(255, 255, 255, 0.04)}
  //       }
  //     }`
  //   }
  // });
}
