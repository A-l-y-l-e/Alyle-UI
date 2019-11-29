import {
  LyStyleUtils,
  Dir,
  lyl,
  shadowBuilder,
  StyleCollection,
  StyleTemplate
} from '@alyle/ui';
import { iconButton, icon, zIndex, animations, RippleVariables } from './variables';
import { Breakpoints } from '@alyle/ui/responsive';

import { LyAvatarTheme } from '@alyle/ui/avatar';
import { ExpansionConfig } from '@alyle/ui/expansion';
import { LySnackBarTheme } from '@alyle/ui/snack-bar';
import { LyButtonTheme } from '@alyle/ui/button';
import { LyBadgeTheme } from '@alyle/ui/badge';
import { LyCheckboxTheme } from '@alyle/ui/checkbox';
import { LyFieldTheme } from '@alyle/ui/field';
import { LySliderTheme } from '@alyle/ui/slider';
import { LyToolbarTheme } from '@alyle/ui/toolbar';

export class MinimaBase extends LyStyleUtils {
  typography = {
    fontFamily: `'Roboto', sans-serif`,
    htmlFontSize: 16,
    fontSize: 14,
    gutterTop: 1,
    gutterBottom: .35,
    lyTyp: { } as {
      [key: string]: (() => StyleTemplate) | StyleCollection
    }
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

  toolbar: LyToolbarTheme = {
    appearance: {
      dense: new StyleCollection(
        () => lyl `{
          height: 56px
        }`
      )
    }
  };

  slider: LySliderTheme = {
    appearance: {
      standard: new StyleCollection()
    },
    color: ({
      track,
      thumb,
      thumbLabel,
      tick,
      disabled,
      thumbContentFocused,
      tickActive,
      bg,
      thumbContent,
      horizontal,
      vertical,
      thumbVisible,
      thumbNotVisible,
      sliding
    }, color) => lyl `{
      & ${track}, & ${thumb}, & ${thumbLabel}, & ${bg}, & ${tick} {
        background-color: ${color}
      }
      &:not(${disabled}) ${thumbContentFocused} ${thumb}::before, &:not(${disabled}) ${thumb}:hover::before {
        box-shadow: 0 0 0 8px ${color.alpha(.13)}
      }
      &${sliding} ${thumbContentFocused} ${thumb}::before {
        box-shadow: 0 0 0 16px ${color.alpha(.13)}
      }
      ${tickActive} {
        background-color: ${color.luminance(0.6)}
      }
      ${bg} {
        opacity: .3
      }

      &:not(${disabled}) {
        & ${thumbContent}::before {
          background: ${color}
        }
        &${horizontal} {
          // always show visible thumb, when {thumbVisible} is available
          &${thumbVisible} ${thumbContent}::before,
          // on hover
          &:not(${thumbNotVisible}) ${thumbContent}:hover::before,
          // on focused
          &:not(${thumbNotVisible}) ${thumbContent}${thumbContentFocused}::before {
            background: linear-gradient(0deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%)
          }
        }
        &${vertical} {
          // always show visible thumb, when {thumbVisible} is available
          &${thumbVisible} ${thumbContent}::before,
          // on hover
          &:not(${thumbNotVisible}) ${thumbContent}:hover::before,
          // on focused
          &:not(${thumbNotVisible}) ${thumbContent}${thumbContentFocused}::before {
            background: linear-gradient(90deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%)
          }
        }
      }
    }`,
    disabled: ({
      track,
      thumb,
      thumbContainer,
      thumbContent,
      thumbLabel,
      bg,
      tick,
      tickActive,
      horizontal,
      vertical
    }, color) => {
      const colorDisabled = color.darken(2)
      .desaturate(2.5);
      const colorDisabledLum0_4 = colorDisabled.luminance(.4);
      return lyl `{
        & ${track},
        & ${thumb},
        & ${thumbLabel},
        & ${bg},
        & ${tick} {
          background-color: ${colorDisabled.luminance(.4).css()}
        }
        ${tickActive} {
          background-color: ${colorDisabled.luminance(.6).css()}
        }
        &${horizontal} {
          & ${thumbContent}::before {
            background: linear-gradient(0deg, ${colorDisabledLum0_4} 0%, rgba(0, 0, 0, 0) 50%, ${colorDisabledLum0_4} 100%)
          }
        }
        &${vertical} {
          & ${thumbContent}::before {
            background: linear-gradient(90deg, ${colorDisabledLum0_4} 0%, rgba(0, 0, 0, 0) 50%, ${colorDisabledLum0_4} 100%)
          }
        }
        ${bg} {
          opacity: .3
        }
        &${horizontal} ${thumbContainer}::before {
          background: ${(this as any).disabled.default}
        }
        &${vertical} ${thumbContainer}::before {
          background: ${(this as any).disabled.default}
        }
      }`;
    }
  };

  constructor() {
    super();
    this.typography.lyTyp = {
      display4: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(96)}
        font-weight: 300
        letter-spacing: ${-1.5 / 96}em
      }`),
      display3: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(60)}
        font-weight: 300
        letter-spacing: ${-0.5 / 60}em
      }`),
      display2: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(48)}
        font-weight: 400
        letter-spacing: 0
      }`),
      display1: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(34)}
        font-weight: 400
        letter-spacing: ${0.25 / 34}em
      }`),
      headline: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(24)}
        font-weight: 400
        letter-spacing: 0
      }`),
      title: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(20)}
        font-weight: 500
        letter-spacing: ${0.15 / 20}
      }`),
      subheading: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(16)}
        font-weight: 400
        letter-spacing: ${0.15 / 16}
        line-height: ${this.pxToRem(24)}
      }`),
      subheading2: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(14)}
        font-weight: 500
        letter-spacing: ${0.1 / 14}
      }`),
      body1: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(16)}
        font-weight: 400,
        letter-spacing: ${0.5 / 16}
      }`),
      body2: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(14)}
        font-weight: 400
        letter-spacing: ${0.25 / 14}
      }`),
      button: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(14)}
        font-weight: 500
        letter-spacing: ${1.25 / 14}
      }`),
      caption: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(12)}
        font-weight: 400
        letter-spacing: ${0.4 / 12}em
      }`),
      overline: new StyleCollection(() => lyl `{
        font-size: ${this.pxToRem(10)}
        font-weight: 400
        letter-spacing: ${1.5 / 10}
        text-transform: uppercase
      }`)
    };

    const { lyTyp } = this.typography;
    lyTyp.h1 = lyTyp.display4;
    lyTyp.h2 = lyTyp.display3;
    lyTyp.h3 = lyTyp.display2;
    lyTyp.h4 = lyTyp.display1;
    lyTyp.h5 = lyTyp.headline;
    lyTyp.h6 = lyTyp.title;
    lyTyp.subtitle1 = lyTyp.subheading;
    lyTyp.subtitle2 = lyTyp.subheading2;
  }
}
