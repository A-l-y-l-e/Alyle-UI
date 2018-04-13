import { AlyleServiceConfig } from './alyle-config-service';
export const defaultTheme: AlyleServiceConfig = {
  primary: 'blue',
  accent: 'pink',
  other: 'red',
  colorScheme: 'light',
  /** TODO: Deprecated */
  typography: {
    fontFamily: '\'Roboto\', sans-serif',
    fontSize: 14
  },
  variables: {
    typography: {
      fontFamily: '\'Roboto\', sans-serif',
      fontSize: 14
    }
  },
  schemes: {
    light: {
      colorText: 'rgba(0, 0, 0, 0.61)',
      disabled: 'rgba(0, 0, 0, 0.31)',
      bgText: '#f9f9f9',
      main: '#fff',
      colorShadow: '#777777',
      input: {
        label: 'rgba(0, 0, 0, 0.4)',
        underline: 'rgba(0, 0, 0, 0.11)'
      },
    },
    dark: {
      colorText: '#fff',
      disabled: 'rgba(255, 255, 255, 0.31)',
      bgText: '#303030',
      main: '#383838',
      colorShadow: '#777777',
      input: {
        label: 'rgba(255, 255, 255, 0.4)',
        underline: 'rgba(255, 255, 255, 0.11)'
      }
    }
  },
  palette: {
    'blue': {
      default: '#2196F3',
      contrast: 'light'
    },
    'pink': {
      default: '#ff4b73',
      contrast: 'light'
    },
    'red': {
      default: '#FF5252',
      contrast: 'light'
    }
  }
};
