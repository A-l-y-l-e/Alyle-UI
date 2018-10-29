import {
  LyStyleUtils,
  TypographyConfig, // Do not delete this, this is necessary to generate the types correctly
  IRippleVariables // Do not delete this, this is necessary to generate the types correctly
} from '@alyle/ui';
import { typography, iconButton, icon, zIndex, animations } from './variables';
import { Breakpoints } from '@alyle/ui/responsive';
import { RippleVariables } from '@alyle/ui/ripple';

export class MinimaBase extends LyStyleUtils {
  typography = typography;
  iconButton = iconButton;
  icon = icon;
  breakpoints = Breakpoints;
  zIndex = zIndex;
  ripple = RippleVariables;
  animations = animations;
  badge = {
    position: {
      // code
    }
  };
}
