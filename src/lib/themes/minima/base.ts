import {
  LyStyleUtils,
  Dir,
  shadowBuilder,
  StyleCollection,
  StyleTemplate } from '@alyle/ui';
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
      small: () => (className: string) => `${className}{padding:0 8px;font-size:${this.pxToRem(13)};min-height:32px;min-width:48p;}`,
      medium: () => (className: string) => `${className}{padding:0 14px;min-height:36px;min-width:64px;}`,
      large: () => (className: string) => `${className}{padding:0 21px;font-size:${this.pxToRem(15)};min-height:40px;min-width:96px;}`
    },
    appearance: {
      icon: () => (className: string) => `${className}{min-width:40px;width:40px;height:40px;padding:0;border-radius:50%;}`,
      fab: () => (className: string) => `${className}{min-width:56px;width:56px;height:56px;padding:0;border-radius:50%;}`,
      miniFab: () => (className: string) => `${className}{min-width:40px;width:40px;height:40px;padding:0;border-radius:50%;}`
    }
  };
  badge: LyBadgeTheme = {
    appearance: {
      default: () => (className: string) => `${className}{padding:0 6px;min-width:22px;height:22px;border-radius:2em;}`,
      dot: () => (className: string) => `${className}{width:6px;height:6px;border-radius:50%;}`
    }
  };
  checkbox: LyCheckboxTheme = {
    color: (checkbox, color) => (className: string) => `${className}${checkbox.checked} ${checkbox.icon}{color:${color};}${className}${checkbox.checked}:not({disabled}) ${checkbox.icon}{box-shadow:${shadowBuilder(1, color)};}`
  };
  expansion: ExpansionConfig = {
    root: classes => (className: string) => `${className} ${classes.panelHeader}{height:48px;}${className} ${classes.expanded} ${classes.panelHeader}{height:64px;}`,
    appearance: {
      popOut: classes => (className: string) => `${className} ${classes.panel}{transition:margin ${this.animations.durations.entering}ms ${this.animations.curves.standard};}${className} ${classes.expanded}${classes.panel}{margin:16px 0;}${className} ${classes.expanded}${classes.panel}:first-child{margin-top:0;}${className} ${classes.expanded}${classes.panel}:last-child{margin-bottom:0jj;}`
    }
  };

  field: LyFieldTheme = {
    appearance: {
      standard: new StyleCollection(
        (classes) => (className: string) => `${className}:not(${classes.disabled}) ${classes.container}:hover:after{border-bottom-color:currentColor;}${className}${classes.disabled} ${classes.container}:after{border-bottom-style:dotted;border-color:inherit;}${className} textarea{inputNative}{margin:0.25em 0;}${className} ${classes.inputNative}:not(textarea){padding:0.25em 0;}${className} ${classes.container}{padding:1em 0 0;}${className} ${classes.container}:after{border-bottom-style:solid;border-bottom-width:1px;}${className}${classes.focused} ${classes.container}:after{border-width:2px;border-color:currentColor;}${className} ${classes.label}{margin:0.25em 0;}${className} ${classes.placeholder}{margin:0.25em 0;}${className} ${classes.floatingLabel}{transform:translateY(-1.25em);}`
      ),
      outlined: new StyleCollection(
        classes => (className: string) => `${className}:not(${classes.focused}):not({disabled}):hover ${classes.fieldset}{border-color:currentColor;}${className}${classes.focused} ${classes.fieldset}{border-width:2px;border-color:inherit;}${className} textarea${classes.inputNative}{margin:1em 0;}${className} ${classes.inputNative}:not(textarea){padding:1em 0;}${className} ${classes.container}{padding:0 0.75em;}${className} ${classes.fieldset}{border-width:1px;border-radius:5px;padding:0 .5em;}${className} ${classes.prefix}:after{padding:0.25em;}${className} ${classes.suffix}:after{padding:0.25em;}${className} ${classes.label}{margin:1em 0;}${className} ${classes.placeholder}{margin:1em 0;}${className} ${classes.floatingLabel}${classes.label}{transform:translateY(-1.75em);}${className} ${classes.hintContainer}{padding:0 0.75em;}`
      ),
      filled: new StyleCollection(
        classes => (className: string) => `${className}:not(${classes.focused}):not(${classes.disabled}) ${classes.container}:hover:after{border-bottom-width:1px;}${className} textarea${classes.inputNative}{margin:1.59375em 0 0.40625em;}${className} ${classes.inputNative}:not(textarea){padding:1.59375em 0 0.40625em;}${className} ${classes.container}{border-radius:5px 5px 0 0;padding:0 0.75em;}${className} ${classes.container}:after{border-bottom-style:solid;border-bottom-color:currentColor;border-bottom-width:0;}${className}${classes.focused} ${classes.container}:after{border-bottom-width:2px;}${className} ${classes.placeholder}{margin:1.59375em 0 0.40625em;}${className} ${classes.label}{margin:1em 0;}${className} ${classes.floatingLabel}${classes.label}{transform:translateY(-.75em);}${className} ${classes.hintContainer}{padding:0 0.75em;}`
      )
    }
  };

  toolbar: LyToolbarTheme = {
    appearance: {
      dense: new StyleCollection(
        () => (className: string) => `${className}{height:56px;}`
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
    }, color) => (className: string) => `${className} ${track},${className} ${thumb},${className} ${thumbLabel},${className} ${bg},${className} ${tick}{background-color:${color};}${className}:not(${disabled}) ${thumbContentFocused} ${thumb}::before,${className}:not(${disabled}) ${thumb}:hover::before{box-shadow:0 0 0 8px ${color.alpha(.13)};}${className}${sliding} ${thumbContentFocused} ${thumb}::before{box-shadow:0 0 0 16px ${color.alpha(.13)};}${className} ${tickActive}{background-color:${color.luminance(0.6)};}${className} ${bg}{opacity:.3;}${className}:not(${disabled}) ${thumbContent}::before{background:${color};}${className}:not(${disabled})${horizontal}${thumbVisible} ${thumbContent}::before,${className}:not(${disabled})${horizontal}:not(${thumbNotVisible}) ${thumbContent}:hover::before,${className}:not(${disabled})${horizontal}:not(${thumbNotVisible}) ${thumbContent}${thumbContentFocused}::before{background:linear-gradient(0deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%);}${className}:not(${disabled})${vertical}${thumbVisible} ${thumbContent}::before,${className}:not(${disabled})${vertical}:not(${thumbNotVisible}) ${thumbContent}:hover::before,${className}:not(${disabled})${vertical}:not(${thumbNotVisible}) ${thumbContent}${thumbContentFocused}::before{background:linear-gradient(90deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%);}`,
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
      return (className: string) => `${className} ${track},${className} ${thumb},${className} ${thumbLabel},${className} ${bg},${className} ${tick}{background-color:${colorDisabled.luminance(.4).css()};}${className} ${tickActive}{background-color:${colorDisabled.luminance(.6).css()};}${className}${horizontal} ${thumbContent}::before{background:linear-gradient(0deg, ${colorDisabledLum0_4} 0%, rgba(0, 0, 0, 0) 50%, ${colorDisabledLum0_4} 100%);}${className}${vertical} ${thumbContent}::before{background:linear-gradient(90deg, ${colorDisabledLum0_4} 0%, rgba(0, 0, 0, 0) 50%, ${colorDisabledLum0_4} 100%);}${className} ${bg}{opacity:.3;}${className}${horizontal} ${thumbContainer}::before{background:${(this as any).disabled.default};}${className}${vertical} ${thumbContainer}::before{background:${(this as any).disabled.default};}`;
    }
  };

  constructor() {
    super();
    this.typography.lyTyp = {
      display4: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(96)};font-weight:300;letter-spacing:${-1.5 / 96}em;}`),
      display3: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(60)};font-weight:300;letter-spacing:${-0.5 / 60}em;}`),
      display2: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(48)};font-weight:400;letter-spacing:0;}`),
      display1: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(34)};font-weight:400;letter-spacing:${0.25 / 34}em;}`),
      headline: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(24)};font-weight:400;letter-spacing:0;}`),
      title: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(20)};font-weight:500;letter-spacing:${0.15 / 20}em;}`),
      subheading: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(16)};font-weight:400;letter-spacing:${0.15 / 16}em;line-height:${this.pxToRem(24)};}`),
      subheading2: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(14)};font-weight:500;letter-spacing:${0.1 / 14}em;}`),
      body1: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(16)};font-weight:400,        letter-spacing: ${0.5 / 16}em;}`),
      body2: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(14)};font-weight:400;letter-spacing:${0.25 / 14}em;}`),
      button: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(14)};font-weight:500;letter-spacing:${1.25 / 14}em;}`),
      caption: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(12)};font-weight:400;letter-spacing:${0.4 / 12}em;}`),
      overline: new StyleCollection(() => (className: string) => `${className}{font-size:${this.pxToRem(10)};font-weight:400;letter-spacing:${1.5 / 10}em;text-transform:uppercase;}`)
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
