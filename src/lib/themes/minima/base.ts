import {
  LyStyleUtils,
  Dir
} from '@alyle/ui';
import { typography, iconButton, icon, zIndex, animations, RippleVariables } from './variables';
import { Breakpoints } from '@alyle/ui/responsive';

export class MinimaBase extends LyStyleUtils {
  typography = typography;
  iconButton = iconButton;
  icon = icon;
  breakpoints = Breakpoints;
  zIndex = zIndex;
  ripple = RippleVariables;
  animations = animations;
  direction = Dir.ltr;
  button = {
    size: {
      small: ({
        padding: '0 8px',
        fontSize: this.pxToRem(this.typography.lyTyp.button.fontSize - 1),
        minHeight: '32px',
        minWidth: '48px'
      }),
      medium: ({
        padding: '0 14px',
        minHeight: '36px',
        minWidth: '64px'
      }),
      large: ({
        padding: '0 21px',
        fontSize: this.pxToRem(this.typography.lyTyp.button.fontSize + 1),
        minHeight: '40px',
        minWidth: '96px'
      })
    },
    appearance: {
      icon: {
        minWidth: '0',
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '50%'
      },
      fab: {
        minWidth: '0',
        width: '56px',
        height: '56px',
        padding: 0,
        borderRadius: '50%'
      },
      miniFab: {
        minWidth: '0',
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '50%'
      }
    }
  };
}
