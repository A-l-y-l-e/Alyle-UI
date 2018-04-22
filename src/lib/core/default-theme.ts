import { ThemeVariables } from './alyle-config-service';
export const defaultTheme: ThemeVariables = {
  primary: 'blue',
  accent: 'pink',
  other: 'red',
  colorScheme: 'light',
  variables: {
    typography: {
      fontFamily: `'Roboto', sans-serif`,
      fontSize: 14
    },
  },
  schemes: {
    light: {
      /** Deprecated */
      colorText: 'rgba(0, 0, 0, 0.87)',
      /** Deprecated */
      bgText: '#f9f9f9',
      /** Deprecated */
      main: '#fff',
      background: {
        default: '#fafafa',
        paper: '#fff'
      },
      text: {
        default: 'rgba(0, 0, 0, 0.87)',
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)'
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      colorShadow: '#777777',
      /** Components variables */
      bar: '#f5f5f5',
      input: {
        label: 'rgba(0, 0, 0, 0.4)',
        underline: 'rgba(0, 0, 0, 0.11)'
      },
    },
    dark: {
      /** Deprecated */
      colorText: '#fff',
      /** Deprecated */
      bgText: '#303030',
      /** Deprecated */
      main: '#383838',
      background: {
        default: '#303030',
        paper: '#424242'
      },
      bar: '#212121',
      text: {
        default: '#fff',
        primary: '#fff',
        secondary: 'rgba(255, 255, 255, 0.70)',
        disabled: 'rgba(255, 255, 255, 0.50)',
        hint: 'rgba(255, 255, 255, 0.50)'
      },
      divider: 'rgba(255, 255, 255, 0.12)',
      colorShadow: '#777777',
      input: {
        label: 'rgba(255, 255, 255, 0.4)',
        underline: 'rgba(255, 255, 255, 0.11)'
      }
    }
  }
};
