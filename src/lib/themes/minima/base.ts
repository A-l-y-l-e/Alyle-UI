import {
  LyStyleUtils,
  Dir
} from '@alyle/ui';
import { iconButton, icon, zIndex, animations, RippleVariables } from './variables';
import { Breakpoints } from '@alyle/ui/responsive';
import { SliderVariables } from '@alyle/ui/slider';
import * as _chroma from 'chroma-js';

const chroma = _chroma;

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

  field = {
    appearance: {
      outlined: {
        '&:not({focused}):not({disabled}):hover {fieldset}': {
          borderColor: 'currentColor'
        },
        '&{focused} {fieldset}': {
          borderWidth: '2px',
          borderColor: 'inherit'
        },
        '& textarea{inputNative}': {
          margin: '1em 0'
        },
        '& {inputNative}:not(textarea)': {
          padding: '1em 0'
        },
        '& {container}': {
          padding: '0 0.75em'
        },
        '& {fieldset}': {
          borderWidth: '1px',
          borderRadius: '5px',
          padding: '0 .5em'
        },
        '& {prefix}': {
          '&:after': {
            padding: '0.25em'
          }
        },
        '& suffix': {
          '&:after': {
            padding: '0.25em'
          }
        },
        '& {label}': {
          margin: '1em 0'
        },
        '& {placeholder}': {
          margin: '1em 0'
        },
        '& {floatingLabel}{label}': {
          transform: 'translateY(-1.75em)'
        },
        '& {hintContainer}': {
          padding: '0 0.75em'
        }
      },
      filled: {
        '&:not({focused}):not({disabled}) {container}:hover:after': {
          borderBottomWidth: '1px'
        },
        'textarea{inputNative}': {
          margin: '1.59375em 0 0.40625em'
        },
        '{inputNative}:not(textarea)': {
          padding: '1.59375em 0 0.40625em'
        },
        '& {container}': {
          borderRadius: '5px 5px 0 0',
          padding: '0 0.75em',
          '&:after': {
            borderBottomStyle: 'solid',
            borderBottomColor: 'currentColor',
            borderBottomWidth: '0'
          }
        },
        '&{focused} {container}': {
          '&:after': {
            borderBottomWidth: '2px'
          }
        },
        '& {placeholder}': {
          margin: '1.59375em 0 0.40625em'
        },
        '& {label}': {
          margin: '1em 0'
        },
        '& {floatingLabel}{label}': {
          transform: 'translateY(-.75em)'
        },
        '& {hintContainer}': {
          padding: '0 0.75em'
        }
      }
    }
  };

  toolbar = {
    appearance: {
      dense: {
        height: '56px'
      }
    }
  };

  slider: SliderVariables = {
    defaultConfig: {
      appearance: 'standard'
    },
    appearance: {
      standard: {
        appearance: _theme => ({

        }),
        color: (_theme, color) => ({
          '& {track}, & {thumb}, & {thumbLabel}, & {bg}, & {tick}': {
            backgroundColor: color
          },
          '{tickActive}': {
            backgroundColor: chroma(color).luminance(0.7).css()
          },
          '{bg}': {
            opacity: .3
          },
          '&{horizontal} {thumbContainer}::before': {
            background: `linear-gradient(0deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%);`
          },
          '&{vertical} {thumbContainer}::before': {
            background: `linear-gradient(90deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%);`
          }
        })
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
