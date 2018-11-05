
export const typography = {
  fontFamily: `'Roboto', sans-serif`,
  htmlFontSize: 16,
  fontSize: 14,
  gutterTop: 1,
  gutterBottom: .35,
  lyTyp: {
    display4: {
      fontSize: 96,
      fontWeight: 300,
      letterSpacing: -1.5
    },
    display3: {
      fontSize: 60,
      fontWeight: 300,
      letterSpacing: -0.5
    },
    display2: {
      fontSize: 48,
      fontWeight: 400,
      letterSpacing: 0
    },
    display1: {
      fontSize: 34,
      fontWeight: 400,
      letterSpacing: 0.25
    },
    headline: {
      fontSize: 24,
      fontWeight: 400,
      letterSpacing: 0
    },
    title: {
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: 0.15
    },
    subheading: {
      fontSize: 16,
      fontWeight: 400,
      letterSpacing: 0.15,
      lineHeight: 24
    },
    subheading2: {
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 0.1
    },
    body2: {
      fontSize: 16,
      fontWeight: 400,
      letterSpacing: 0.15
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      letterSpacing: 0.25
    },
    button: {
      fontSize: 14,
      fontWeight: 500
    },
    caption: {
      fontSize: 12,
      fontWeight: 400,
      letterSpacing: 0.4
    },
    overline: {
      fontSize: 10,
      fontWeight: 400,
      letterSpacing: 1.5,
      textTransform: 'uppercase'
    }
  }
};
export const iconButton = {
  size: '48px'
};
export const icon = {
  fontSize: '24px'
};
export const field = {
  appearance: {
    outlined: {
      container: {
        padding: '0 0.75em'
      },
      fieldset: {
        borderWidth: '1px',
        borderRadius: '5px',
        padding: '0 .5em'
      },
      fieldsetHover: {
        borderWidth: '1px',
        borderColor: 'currentColor'
      },
      fieldsetFocused: {
        borderWidth: '2px'
      },
      containerLabelFocused: {
        color: 'currentColor',
        '&:after': {
          borderWidth: '2px',
          borderColor: 'currentColor'
        }
      },
      prefix: {
        '&:after': {
          padding: '0.25em'
        }
      },
      suffix: {
        '&:after': {
          padding: '0.25em'
        }
      },
      input: {
        margin: '1.1875em 0'
      },
      label: {
        margin: '1.1875em 0'
      },
      placeholder: {
        margin: '1.1875em 0'
      },
      floatingLabel: {
        transform: 'translateY(-1.75em)'
      },
      hint: {
        padding: '0 0.75em'
      }
    },
    filled: {
      container: {
        borderRadius: '5px 5px 0 0',
        padding: '0 0.75em',
        '&:after': {
          borderBottomStyle: 'solid',
          borderBottomColor: 'currentColor',
          borderBottomWidth: '0'
        },
        '&:hover:after': {
          borderBottomWidth: '1px'
        }
      },
      containerFocused: {
        '&:after': {
          borderBottomWidth: '2px'
        }
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
        margin: '1.78125em 0 0.59375em'
      },
      placeholder: {
        margin: '1.78125em 0 0.59375em'
      },
      label: {
        margin: '1.1875em 0'
      },
      floatingLabel: {
        transform: 'translateY(-.75em)'
      },
      hint: {
        padding: '0 0.75em'
      }
    }
  }
};

export const zIndex = {
  toolbar: 1000,
  drawer: 1100,
  overlay: 1200
};

export const RippleVariables = {
  transition: {
    opacity: 'cubic-bezier(0.4,0.0,1,1)',
    transform: 'cubic-bezier(0, 1, 0.6, 1)'
  },
  duration: 950
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
