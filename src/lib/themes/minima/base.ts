import {
  LyStyleUtils,
  Dir,
  StyleContainer,
  lyl,
  shadowBuilder,
  StyleCollection
} from '@alyle/ui';
import { iconButton, icon, zIndex, animations, RippleVariables } from './variables';
import { Breakpoints } from '@alyle/ui/responsive';

import { LyAvatarVariables, LyAvatarTheme } from '@alyle/ui/avatar';
import { ExpansionVariables, ExpansionConfig } from '@alyle/ui/expansion';
import { SliderVariables } from '@alyle/ui/slider';
import { LySnackBarTheme } from '@alyle/ui/snack-bar';
import { LyButtonTheme } from '@alyle/ui/button';
import { LyBadgeTheme } from '@alyle/ui/badge';
import { LyCheckboxTheme } from '@alyle/ui/checkbox';
import { LyFieldTheme } from '@alyle/ui/field';

export class MinimaBase extends LyStyleUtils implements ExpansionVariables, LyAvatarVariables {
  typography = {
    fontFamily: `'Roboto', sans-serif`,
    htmlFontSize: 16,
    fontSize: 14,
    gutterTop: 1,
    gutterBottom: .35,
    lyTyp: {}
  };
  avatar?: LyAvatarTheme;
  snackBar?: LySnackBarTheme;
  iconButton = iconButton;
  icon = icon;
  breakpoints = Breakpoints;
  zIndex = zIndex;
  ripple = RippleVariables;
  animations = animations;
  direction = Dir.ltr;
  button: LyButtonTheme = {
    size: {
      small: () => lyl `{
        padding: 0 8px
        font-size: ${this.pxToRem(13)}
        min-height: 32px
        min-width: 48p
      }`,
      medium: () => lyl `{
        padding: 0 14px
        min-height: 36px
        min-width: 64px
      }`,
      large: () => lyl `{
        padding: 0 21px
        font-size: ${this.pxToRem(15)}
        min-height: 40px
        min-width: 96px
      }`
    },
    appearance: {
      icon: () => lyl `{
        min-width: 40px
        width: 40px
        height: 40px
        padding: 0
        border-radius: 50%
      }`,
      fab: () => lyl `{
        min-width: 56px
        width: 56px
        height: 56px
        padding: 0
        border-radius: 50%
      }`,
      miniFab: () => lyl `{
        min-width: 40px
        width: 40px
        height: 40px
        padding: 0
        border-radius: 50%
      }`
    }
  };
  badge: LyBadgeTheme = {
    appearance: {
      default: () => lyl `{
        padding: 0 6px
        min-width: 22px
        height: 22px
        border-radius: 2em
      }`,
      dot: () => lyl `{
        width: 6px
        height: 6px
        border-radius: 50%
      }`
    }
  };
  checkbox: LyCheckboxTheme = {
    color: (checkbox, color) => lyl `{
      &${checkbox.checked} ${checkbox.icon} {
        color: ${color}
      }
      &${checkbox.checked}:not({disabled}) ${checkbox.icon} {
        box-shadow: ${shadowBuilder(1, color)}
      }
    }`
  };
  expansion: ExpansionConfig = {
    root: classes => lyl `{
      ${classes.panelHeader} {
        height: 48px
      }
      ${classes.expanded} ${classes.panelHeader} {
        height: 64px
      }
    }`,
    appearance: {
      popOut: classes => lyl `{
        ${classes.panel} {
          transition: margin ${this.animations.durations.entering}ms ${this.animations.curves.standard}
        }
        ${classes.expanded}${classes.panel} {
          margin: 16px 0
          &:first-child {
            margin-top: 0
          }
          &:last-child {
            margin-bottom: 0jj
          }
        }
      }`
    }
  };

  field: LyFieldTheme = {
    appearance: {
      standard: new StyleCollection(
        (classes) => lyl `{
          &:not(${classes.disabled}) ${classes.container}:hover:after {
            border-bottom-color: currentColor
          }
          &${classes.disabled} ${classes.container}:after {
            border-bottom-style: dotted
            border-color: inherit
          }
          textarea{inputNative} {
            margin: 0.25em 0
          }
          ${classes.inputNative}:not(textarea) {
            padding: 0.25em 0
          }
          & ${classes.container} {
            padding: 1em 0 0
            &:after {
              border-bottom-style: solid
              border-bottom-width: 1px
            }
          }
          &${classes.focused} ${classes.container} {
            &:after {
              border-width: 2px
              border-color: currentColor
            }
          }
          & ${classes.label} {
            margin: 0.25em 0
          }
          & ${classes.placeholder} {
            margin: 0.25em 0
          }
          & ${classes.floatingLabel} {
            transform: translateY(-1.25em)
          }
        }`
      ),
      outlined: new StyleCollection(
        classes => lyl `{
          &:not(${classes.focused}):not({disabled}):hover ${classes.fieldset} {
            border-color: currentColor
          }
          &${classes.focused} ${classes.fieldset} {
            border-width: 2px
            border-color: inherit
          }
          & textarea${classes.inputNative} {
            margin: 1em 0
          }
          & ${classes.inputNative}:not(textarea) {
            padding: 1em 0
          }
          & ${classes.container} {
            padding: 0 0.75em
          }
          & ${classes.fieldset} {
            border-width: 1px
            border-radius: 5px
            padding: 0 .5em
          }
          & ${classes.prefix} {
            &:after {
              padding: 0.25em
            }
          }
          & ${classes.suffix} {
            &:after {
              padding: 0.25em
            }
          }
          & ${classes.label} {
            margin: 1em 0
          }
          & ${classes.placeholder} {
            margin: 1em 0
          }
          & ${classes.floatingLabel}${classes.label} {
            transform: translateY(-1.75em)
          }
          & ${classes.hintContainer} {
            padding: 0 0.75em
          }
        }`
      ),
      filled: new StyleCollection(
        classes => lyl `{
          &:not(${classes.focused}):not(${classes.disabled}) ${classes.container}:hover:after {
            border-bottom-width: 1px
          }
          textarea${classes.inputNative} {
            margin: 1.59375em 0 0.40625em
          }
          ${classes.inputNative}:not(textarea) {
            padding: 1.59375em 0 0.40625em
          }
          & ${classes.container} {
            border-radius: 5px 5px 0 0
            padding: 0 0.75em
            &:after {
              border-bottom-style: solid
              border-bottom-color: currentColor
              border-bottom-width: 0
            }
          }
          &${classes.focused} ${classes.container} {
            &:after {
              border-bottom-width: 2px
            }
          }
          & ${classes.placeholder} {
            margin: 1.59375em 0 0.40625em
          }
          & ${classes.label} {
            margin: 1em 0
          }
          & ${classes.floatingLabel}${classes.label} {
            transform: translateY(-.75em)
          }
          & ${classes.hintContainer} {
            padding: 0 0.75em
          }
        }`
      )
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
          '&:not({disabled}) {thumbContentFocused} {thumb}::before, &:not({disabled}) {thumb}:hover::before': {
            boxShadow: `0 0 0 8px ${color.alpha(.13)}`
          },
          '&{sliding} {thumbContentFocused} {thumb}::before': {
            boxShadow: `0 0 0 16px ${color.alpha(.13)}`
          },
          '{tickActive}': {
            backgroundColor: color.luminance(0.6)
          },
          '{bg}': {
            opacity: .3
          },

          '& {thumbContent}::before': {
            background: color
          },
          '&:not({disabled})': [['horizontal', 0], ['vertical', 90]].reduce((prev, orientation) => {
            prev[`&{${orientation[0]}}`] = {
              [
                [
                  // always show visible thumb, when {thumbVisible} is available
                  '&{thumbVisible} {thumbContent}::before',
                  // on hover
                  '&:not({thumbNotVisible}) {thumbContent}:hover::before',
                  // on focused
                  '&:not({thumbNotVisible}) {thumbContent}{thumbContentFocused}::before'
                ].join()
              ]: {
                background: `linear-gradient(${orientation[1]}deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%);`
              },
            };
            return prev;
          }, { } as StyleContainer)
        }),
        disabled: (theme, color) => {
          const colorDisabled = color.darken(2)
          .desaturate(2.5);
          return ({
            '& {track}, & {thumb}, & {thumbLabel}, & {bg}, & {tick}': {
              backgroundColor: colorDisabled.luminance(.4).css()
            },
            '{tickActive}': {
              backgroundColor: colorDisabled.luminance(.6).css()
            },
            '&': [['horizontal', 0], ['vertical', 90]].reduce((prev, orientation) => {
              prev[`&{${orientation[0]}}`] = {
                '& {thumbContent}::before': {
                  background: `linear-gradient(${
                    orientation[1]
                  }deg, ${
                    colorDisabled.luminance(.4).css()
                  } 0%, rgba(0, 0, 0, 0) 50%, ${
                    colorDisabled.luminance(.4).css()
                  } 100%);`
                },
              };
              return prev;
            }, { } as StyleContainer),
            '{bg}': {
              opacity: .3
            },
            '&{horizontal} {thumbContainer}::before': {
              background: theme.disabled.default
            },
            '&{vertical} {thumbContainer}::before': {
              background: theme.disabled.default
            }
          });
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
