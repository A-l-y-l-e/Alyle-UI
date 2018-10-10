import { TypographyConfig, LY_COMMON_STYLES } from '@alyle/ui';

export const typography = {
  fontFamily: `'Roboto', sans-serif`,
  htmlFontSize: 16,
  fontSize: 14,
  gutterTop: 1,
  gutterBottom: .35,
  display4: {
    fontSize: 96,
    fontWeight: 300,
    letterSpacing: -1.5
  } as TypographyConfig,
  display3: {
    fontSize: 60,
    fontWeight: 300,
    letterSpacing: -0.5
  } as TypographyConfig,
  display2: {
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: 0
  } as TypographyConfig,
  display1: {
    fontSize: 34,
    fontWeight: 400,
    letterSpacing: 0.25
  } as TypographyConfig,
  headline: {
    fontSize: 24,
    fontWeight: 400,
    letterSpacing: 0
  } as TypographyConfig,
  title: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: 0.15
  } as TypographyConfig,
  subheading: {
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0.15,
    lineHeight: 24
  } as TypographyConfig,
  subheading2: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.1
  } as TypographyConfig,
  body2: {
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0.15
  } as TypographyConfig,
  body1: {
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.25
  } as TypographyConfig,
  button: {
    fontSize: 14,
    fontWeight: 500
  } as TypographyConfig,
  caption: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.4
  } as TypographyConfig,
  overline: {
    fontSize: 10,
    fontWeight: 400,
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  } as TypographyConfig
};
export const iconButton = {
  size: '48px'
};
export const icon = {
  fontSize: '24px'
};
export const input = {
  /** @deprecated default color */
  withColor: 'primary',
  appearance: {
    standard: {
      containerLabel: {
        color: 'rgba(0,0,0,.12)',
        borderBottom: 'solid 1px currentColor'
      },
      containerLabelFocused: {
        color: 'currentColor',
        borderWidth: '2px',
        borderColor: 'currentColor'
      },
      containerLabelHover: {
        color: 'currentColor'
      },
      label: {
        marginTop: '.75em',
        marginBottom: '.25em',
        paddingTop: '1em'
      },
      input: {
        marginTop: '.75em',
        marginBottom: '.25em'
      },
      labelFloating: {
        transform: 'translateY(-1em)'
      }
    }, // default & important
    outlined: {
      containerLabel: {
        color: 'rgba(0,0,0,.12)',
        '&:before': {
          ...LY_COMMON_STYLES.fill,
          content: `\'\'`
        },
        '&:after': {
          ...LY_COMMON_STYLES.fill,
          content: `\'\'`
        }
      },
      containerLabelHover: {
        color: 'currentColor'
      },
      containerLabelFocused: {
        color: 'currentColor',
        '&:after': {
          borderWidth: '2px',
          borderColor: 'currentColor',
        }
      },
      label: {
        margin: '0 .5em',
        marginTop: '1em',
      },
      placeholder: {
        paddingTop: '1em'
      },
      containerLabelStart: {
        paddingRight: '.375em',
        '&:after': {
          border: 'solid 1px currentColor',
          borderRadius: '5px 0 0 5px',
          borderRight: 'none',
        }
      },
      containerLabelCenter: {
        maxWidth: 'calc(100% - 1em)',
        '&:before': {
          borderTop: 'solid 1px currentColor',
        },
        '&:after': {
          borderBottom: 'solid 1px currentColor',
        }
      },
      containerLabelCenterFloating: {
        '&:before': {
          borderWidth: '0 !important'
        }
      },
      containerLabelEnd: {
        paddingRight: '.375em',
        '&:after': {
          border: 'solid 1px currentColor',
          borderRadius: '0 5px 5px 0',
          borderLeft: 'none'
        }
      },
      input: {
        margin: '0 .75em',
        marginTop: '.25em',
        marginBottom: '.75em'
      },
      labelFloating: {
        transform: 'translateY(-1.75em)'
      }
    },
    filled: {
      container: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: '5px 5px 0 0'
      },
      containerLabel: {
        // color: 'rgba(0,0,0,.12)',
        color: 'transparent',
        borderBottom: 'solid 1px currentColor'
      },
      containerLabelFocused: {
        color: 'currentColor',
        borderWidth: '2px',
        borderColor: 'currentColor'
      },
      containerLabelHover: {
        color: 'currentColor'
      },
      input: {
        margin: '0 .75em',
        marginTop: '.75em',
        marginBottom: '.25em'
      },
      placeholder: {
        paddingTop: '1em'
      },
      containerLabelStart: {
        paddingRight: '.75em'
      },
      containerLabelCenter: {
        maxWidth: 'calc(100% - 1em)'
      },
      containerLabelEnd: {
        paddingRight: '.75em'
      },
      label: {
        marginTop: '1em',
      },
      labelFloating: {
        transform: 'translateY(-.25em)'
      }
    }
  }
};

export const zIndex = {
  toolbar: 1000,
  drawer: 1100,
  overlay: 1200
};

export const animations = {
  curves: {
    standard: 'cubic-bezier(0.4,0.0,0.2,1)',
    deceleration: 'cubic-bezier(0.0,0.0,0.2,1)',
    acceleration: 'cubic-bezier(0.4,0.0,1,1)',
    sharp: 'cubic-bezier(0.4,0.0,0.6,1)'
  },
  durations: {
    complex: 375,
    entering: 225,
    exiting: 195
  }
};
