import { ThemeVariables } from './alyle-config-service';
const contrast = '#fff';
export const defaultTheme: ThemeVariables = {
  name: 'default',
  primary: {
    default: '#2196F3',
    contrast
  },
  accent: {
    default: '#ff4b73',
    contrast
  },
  warn: {
    default: '#FF5252',
    contrast
  },
  scheme: 'light',
  typography: {
    fontFamily: `'Roboto', sans-serif`,
    fontSize: 14
  },
  colorSchemes: {
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
      button: {
        disabled: 'rgba(0, 0, 0, 0.11)'
      },
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
      text: {
        default: '#fff',
        primary: '#fff',
        secondary: 'rgba(255, 255, 255, 0.70)',
        disabled: 'rgba(255, 255, 255, 0.50)',
        hint: 'rgba(255, 255, 255, 0.50)'
      },
      /** Components variables */
      button: {
        disabled: 'rgba(255, 255, 255, 0.30)'
      },
      bar: '#212121',
      divider: 'rgba(255, 255, 255, 0.12)',
      colorShadow: '#777777',
      input: {
        label: 'rgba(255, 255, 255, 0.4)',
        underline: 'rgba(255, 255, 255, 0.11)'
      }
    }
  }
};
