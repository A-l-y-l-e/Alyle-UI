import { TypographyConfig } from '@alyle/ui';

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
  /** default color */
  withColor: 'primary',
  appearance: {
    standard: {
      input: {
        marginTop: 'auto',
        marginBottom: '.5em'
      },
      floatingLabel: {
        bottom: '2.125em'
      }
    }, // default & important
    outlined: {},
    filled: {
      background: '#ccc',
      container: { }
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
