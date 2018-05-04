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
      background: {
        default: '#fafafa', // secondary
        primary: '#fff',
        secondary: '#fafafa',
        tertiary: '#f5f5f5',
        base: '#E0E0E0'
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
      radio: {
        radioOuterCircle: 'rgba(0, 0, 0, 0.43)'
      },
      menu: {
        bg: '#fff' // background>primary
      },
      drawer: {
        backdrop: 'rgba(0,0,0,.6)'
      },
      bar: '#f5f5f5',
      input: {
        label: 'rgba(0, 0, 0, 0.4)',
        underline: 'rgba(0, 0, 0, 0.11)'
      },
    },
    dark: {
      primary: {
        default: '#9c27b0',
        contrast
      },
      accent: {
        default: '#ffeb3b',
        contrast: 'rgba(0, 0, 0, 0.87)'
      },
      warn: {
        default: '#f44336',
        contrast: 'rgba(0, 0, 0, 0.87)'
      },
      background: {
        default: '#303030', // secondary
        primary: '#424242',
        secondary: '#303030',
        tertiary: '#212121',
        base: '#0E0E0E'
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
      radio: {
        radioOuterCircle: 'rgba(255, 255, 255, 0.55)'
      },
      menu: {
        bg: '#424242' // background>primary
      },
      drawer: {
        backdrop: 'rgba(49,49,49,.6)'
      },
      bar: '#212121',
      divider: 'rgba(255, 255, 255, 0.12)',
      colorShadow: 'rgba(0, 0, 0, 1)',
      input: {
        label: 'rgba(255, 255, 255, 0.4)',
        underline: 'rgba(255, 255, 255, 0.11)'
      }
    }
  }
};
