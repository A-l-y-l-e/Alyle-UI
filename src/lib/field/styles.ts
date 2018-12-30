import { ThemeVariables, LY_COMMON_STYLES } from '@alyle/ui';
export const STYLES = (theme: ThemeVariables) => {
  return {
    root: {
      display: 'inline-block',
      position: 'relative',
      marginTop: '1em',
      lineHeight: 1.125,
      '& {hint}, & {error}': {
        display: 'block',
        fontSize: '.75em',
        marginTop: '.5em'
      },
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
      '&:after': {
        ...LY_COMMON_STYLES.fill,
        content: `\'\'`,
        pointerEvents: 'none',
        borderColor: theme.field.borderColor
      }
    },
    fieldset: {
      ...LY_COMMON_STYLES.fill,
      margin: 0,
      borderStyle: 'solid',
      borderColor: theme.field.borderColor,
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
      width: '100%'
    },
    suffix: {
      maxHeight: '2em',
      display: 'flex',
      alignItems: 'center'
    },
    labelContainer: {
      ...LY_COMMON_STYLES.fill,
      pointerEvents: 'none',
      display: 'flex',
      width: '100%',
      borderColor: theme.field.borderColor
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
      ...LY_COMMON_STYLES.fill,
      margin: 0,
      border: 'none',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: theme.field.labelColor,
      width: '100%'
    },
    isFloatingLabel: {},
    floatingLabel: {
      '& {labelSpan}': {
        fontSize: '75%'
      }
    },
    placeholder: {
      ...LY_COMMON_STYLES.fill,
      pointerEvents: 'none',
      color: theme.field.labelColor
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
      width: '100%'
    },
    hintContainer: {
      minHeight: '1.25em',
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
        color: theme.disabled.contrast,
        cursor: 'default'
      }
    },
    hint: null,
    error: null,
    errorState: {
      '& {label}, & {hintContainer}': {
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
      }
    },
    hintAfter: {
      marginBefore: 'auto'
    },
    hintBefore: {
      marginAfter: 'auto'
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
