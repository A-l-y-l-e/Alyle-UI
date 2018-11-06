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
}
