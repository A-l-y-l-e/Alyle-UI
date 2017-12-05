import { AlyleServiceConfig } from './alyle-config-service';
export const defaultTheme: AlyleServiceConfig = {
  primary: 'blue',
  accent: 'pink',
  other: 'red',
  colorScheme: 'light',
  typography: {
    fontFamily: '\'Roboto\', sans-serif',
    fontSize: 14
  },
  schemes: {
    light: {
      colorText: 'rgba(0, 0, 0, 0.61)',
      disabled: 'rgba(0, 0, 0, 0.31)',
      bgText: '#f9f9f9',
      main: '#fff',
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
      input: {
        label: 'rgba(255, 255, 255, 0.4)',
        underline: 'rgba(255, 255, 255, 0.11)'
      }
    }
  },
  shade: '500',
  palette: {
    'blue': {
      '500': '#2196F3',
      contrast: 'light'
    },
    'pink': {
      '500': '#ff4b73',
      contrast: 'light'
    },
    'red': {
      '500': '#FF5252',
      contrast: 'light'
    }
  }
};
