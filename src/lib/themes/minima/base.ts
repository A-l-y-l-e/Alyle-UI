import {
  LyStyleUtils,
  Dir
} from '@alyle/ui';
import { iconButton, icon, zIndex, animations, RippleVariables } from './variables';
import { Breakpoints } from '@alyle/ui/responsive';

export class MinimaBase extends LyStyleUtils {
  typography = {
    fontFamily: `'Roboto', sans-serif`,
    htmlFontSize: 16,
    fontSize: 14,
    gutterTop: 1,
    gutterBottom: .35,
    lyTyp: {}
  };
  iconButton = iconButton;
  icon = icon;
  breakpoints = Breakpoints;
  zIndex = zIndex;
  ripple = RippleVariables;
  animations = animations;
  direction = Dir.ltr;
  button = {
    defaultConfig: {
      size: 'medium' as 'medium'
    },
    size: {
      small: ({
        padding: '0 8px',
        fontSize: this.pxToRem(13),
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
        fontSize: this.pxToRem(15),
        minHeight: '40px',
        minWidth: '96px'
      })
    },
    appearance: {
      icon: {
        minWidth: '40px',
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '50%'
      },
      fab: {
        minWidth: '56px',
        width: '56px',
        height: '56px',
        padding: 0,
        borderRadius: '50%'
      },
      miniFab: {
        minWidth: '40px',
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '50%'
      }
    }
  };
  expansion = {
    root: {
      '& {panelHeader}': {
        height: '48px'
      },
      '& {expanded} {panelHeader}': {
        height: '64px'
      },
    },
    appearance: {
      popOut: {
        '& {panel}': {
          transition: `margin ${this.animations.durations.entering}ms ${this.animations.curves.standard}`
        },
        '& {expanded}{panel}': {
          margin: '16px 0',
          '&:first-child': {
            marginTop: 0
          },
          '&:last-child': {
            marginBottom: 0
          }
        }
      }
    }
  };
  constructor() {
    super();
    this.typography.lyTyp = {
      display4: {
        fontSize: this.pxToRem(96),
        fontWeight: 300,
        letterSpacing: this.pxToRem(-1.5)
      },
      display3: {
        fontSize: this.pxToRem(60),
        fontWeight: 300,
        letterSpacing: this.pxToRem(-0.5)
      },
      display2: {
        fontSize: this.pxToRem(48),
        fontWeight: 400,
        letterSpacing: 0
      },
      display1: {
        fontSize: this.pxToRem(34),
        fontWeight: 400,
        letterSpacing: this.pxToRem(0.25)
      },
      headline: {
        fontSize: this.pxToRem(24),
        fontWeight: 400,
        letterSpacing: 0
      },
      title: {
        fontSize: this.pxToRem(20),
        fontWeight: 500,
        letterSpacing: this.pxToRem(0.15)
      },
      subheading: {
        fontSize: this.pxToRem(16),
        fontWeight: 400,
        letterSpacing: this.pxToRem(0.15),
        lineHeight: 24
      },
      subheading2: {
        fontSize: this.pxToRem(14),
        fontWeight: 500,
        letterSpacing: this.pxToRem(0.1)
      },
      body2: {
        fontSize: this.pxToRem(16),
        fontWeight: 400,
        letterSpacing: this.pxToRem(0.15)
      },
      body1: {
        fontSize: this.pxToRem(14),
        fontWeight: 400,
        letterSpacing: this.pxToRem(0.25)
      },
      button: {
        fontSize: this.pxToRem(14),
        fontWeight: 500
      },
      caption: {
        fontSize: this.pxToRem(12),
        fontWeight: 400,
        letterSpacing: 0.4
      },
      overline: {
        fontSize: this.pxToRem(10),
        fontWeight: 400,
        letterSpacing: this.pxToRem(1.5),
        textTransform: 'uppercase'
      }
    };
  }
}
