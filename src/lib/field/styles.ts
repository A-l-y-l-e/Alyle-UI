import { ThemeVariables, LY_COMMON_STYLES_DEPRECATED } from '@alyle/ui';

export const STYLE_SELECT_ARROW = ({
  '&:after': {
    position: 'absolute',
    content: `\'\'`,
    width: 0,
    height: 0,
    borderLeft: '0.3125em solid transparent',
    borderRight: '0.3125em solid transparent',
    borderTop: '0.3125em solid',
    top: '50%',
    after: 0,
    marginTop: '-0.15625em',
    pointerEvents: 'none'
  }
});

export const STYLES = (theme: ThemeVariables) => {
  const field = theme.field!;
  const selectionStyle = {
    backgroundColor: `${theme.warn.default} !important`,
    color: `${theme.warn.contrast} !important`
  };
  return {
    root: {
      display: 'inline-block',
      position: 'relative',
      marginTop: '1em',
      lineHeight: 1.5,
      '& {hint}, & {error}': {
        display: 'block',
        fontSize: '.75em',
        marginTop: '.25em'
      },
      '&': theme.field ? theme.field.root : null
    },
    animations: {
      '& {labelSpan}': {
        transition: `font-size ${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s`
      },
      '& {label}': {
        transition: `${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s`
      }
    },
    container: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      '-webkit-tap-highlight-color': 'transparent',
      '&:after': {
        ...LY_COMMON_STYLES_DEPRECATED.fill,
        content: `\'\'`,
        pointerEvents: 'none',
        borderColor: field.borderColor
      }
    },
    fieldset: {
      ...LY_COMMON_STYLES_DEPRECATED.fill,
      margin: 0,
      borderStyle: 'solid',
      borderColor: field.borderColor,
      borderWidth: 0
    },
    fieldsetSpan: {
      padding: 0,
      height: '2px'
    },
    labelSpan: {
      maxWidth: '100%',
      display: 'inline-block'
    },
    prefix: {
      maxHeight: '2em',
      display: 'flex',
      alignItems: 'center'
    },
    infix: {
      display: 'inline-flex',
      position: 'relative',
      alignItems: 'baseline',
      minWidth: 0,
      width: '180px',
      flex: '1 0'
    },
    suffix: {
      maxHeight: '2em',
      display: 'flex',
      alignItems: 'center'
    },
    labelContainer: {
      ...LY_COMMON_STYLES_DEPRECATED.fill,
      pointerEvents: 'none',
      display: 'flex',
      width: '100%',
      borderColor: field.borderColor
    },
    labelSpacingStart: {},
    labelCenter: {
      display: 'flex',
      maxWidth: '100%'
    },
    labelSpacingEnd: {
      flex: 1
    },
    label: {
      ...LY_COMMON_STYLES_DEPRECATED.fill,
      margin: 0,
      border: 'none',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: field.labelColor,
      width: '100%'
    },
    isFloatingLabel: {},
    floatingLabel: {
      '& {labelSpan}': {
        fontSize: '75%'
      }
    },
    placeholder: {
      ...LY_COMMON_STYLES_DEPRECATED.fill,
      pointerEvents: 'none',
      color: field.labelColor
    },
    focused: {},
    inputNative: {
      resize: 'vertical',
      padding: 0,
      outline: 'none',
      border: 'none',
      backgroundColor: 'transparent',
      color: 'inherit',
      font: 'inherit',
      width: '100%',
      'select&': {
        '-moz-appearance': 'none',
        '-webkit-appearance': 'none',
        position: 'relative',
        backgroundColor: 'transparent',
        display: 'inline-flex',
        boxSizing: 'border-box',
        paddingAfter: '1em',
        'option:not([disabled])': {
          color: 'initial'
        },
        'optgroup:not([disabled])': {
          color: 'initial'
        }
      },
      'select&::-ms-expand': {
        display: 'none'
      },
      'select&::-moz-focus-inner': {
        border: 0
      },
      'select&:not(:disabled)': {
        cursor: 'pointer'
      },
      'select&::-ms-value': {
        color: 'inherit',
        background: '0 0'
      }
    },
    hintContainer: {
      minHeight: '1.25em',
      lineHeight: '1.25',
      '>div': {
        display: 'flex',
        flex: '1 0 auto',
        maxWidth: '100%',
        overflow: 'hidden',
        justifyContent: 'space-between'
      }
    },
    disabled: {
      '&, & {label}, & {container}:after': {
        color: theme.disabled.default,
        cursor: 'default'
      }
    },
    hint: null,
    error: null,
    errorState: {
      '& {label}, & {hintContainer}, &{selectArrow} {infix}:after': {
        color: `${theme.warn.default}!important`
      },
      '& {fieldset}, & {container}:after': {
        borderColor: `${theme.warn.default}!important`
      },
      '& {inputNative}': {
        caretColor: `${theme.warn.default}!important`
      },
      // hidde all hints except after hint
      '& {hintContainer} ly-hint:not({hintAfter})': {
        display: 'none'
      },
      '& {labelSpan}': {
        animation: `{shake} ${theme.animations.durations.complex}ms ${theme.animations.curves.deceleration}`
      },
      '& {inputNative}::selection': selectionStyle,
      '& {inputNative}::-moz-selection': selectionStyle
    },
    hintAfter: {
      marginBefore: 'auto'
    },
    hintBefore: {
      marginAfter: 'auto'
    },
    selectArrow: {
      '{infix}': STYLE_SELECT_ARROW
    },
    $keyframes: {
      shake: {
        0: {
          marginBefore: 0
        },
        40: {
          marginBefore: '2px'
        },
        50: {
          marginBefore: '-2px'
        },
        70: {
          marginBefore: '2px'
        },
        100: {
          marginBefore: 0
        },
      }
    }
  };
};
