
export const iconButton = {
  size: '48px'
};
export const icon = {
  fontSize: '24px'
};
export const field = {
  appearance: {
    outlined: {
      root: {
        '&:not({focused}):not({disabled}):hover {fieldset}': {
          borderColor: 'currentColor'
        },
        '&{focused} {fieldset}': {
          borderWidth: '2px',
          borderColor: 'inherit'
        },
        'textarea{inputNative}': {
          margin: '1em 0'
        },
        '{inputNative}:not(textarea)': {
          padding: '1em 0'
        }
      },
      container: {
        padding: '0 0.75em'
      },
      fieldset: {
        borderWidth: '1px',
        borderRadius: '5px',
        padding: '0 .5em'
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
      label: {
        margin: '1em 0'
      },
      placeholder: {
        margin: '1em 0'
      },
      floatingLabel: {
        transform: 'translateY(-1.75em)'
      },
      hint: {
        padding: '0 0.75em'
      }
    },
    filled: {
      root: {
        '&:not({focused}):not({disabled}) {container}:hover:after': {
          borderBottomWidth: '1px'
        },
        'textarea{inputNative}': {
          margin: '1.59375em 0 0.40625em'
        },
        '{inputNative}:not(textarea)': {
          padding: '1.59375em 0 0.40625em'
        }
      },
      container: {
        borderRadius: '5px 5px 0 0',
        padding: '0 0.75em',
        '&:after': {
          borderBottomStyle: 'solid',
          borderBottomColor: 'currentColor',
          borderBottomWidth: '0'
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
      placeholder: {
        margin: '1.59375em 0 0.40625em'
      },
      label: {
        margin: '1em 0'
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
