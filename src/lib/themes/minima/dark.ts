import { field } from './variables';
import { ThemeConfig, mergeDeep } from '@alyle/ui';
import { MinimaBase } from './base';

const contrast = '#fff';
const shadow = 'rgba(0, 0, 0, 1)';
export class MinimaDark extends MinimaBase implements ThemeConfig {
  name = 'minima-dark';
  primary = {
    default: '#1DE9B6',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
  accent = {
    default: '#9C27B0',
    contrast
  };
  warn = {
    default: '#EA404C',
    contrast
  };
  disabled = {
    default: 'rgba(255, 255, 255, 0.3)',
    contrast: 'rgba(255, 255, 255, 0.5)'
  };
  action = {
    default: 'rgba(255, 255, 255, 0.70)',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
  background = {
    default: '#303030', // secondary
    primary: {
      default: '#2b2b2b',
      shadow
    },
    secondary: '#303030',
    tertiary: '#212121',
    base: '#0E0E0E'
  };
  paper = {
    default: '#2b2b2b',
    shadow
  };
  text = {
    default: '#fff',
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.70)',
    disabled: 'rgba(255, 255, 255, 0.50)',
    hint: 'rgba(255, 255, 255, 0.50)'
  };
  radio = {
    outerCircle: 'rgba(255, 255, 255, 0.55)'
  };
  menu = {};
  drawer = {
    backdrop: 'rgba(49,49,49,.6)'
  };
  bar = '#212121';
  divider = 'rgba(255, 255, 255, 0.12)';
  colorShadow = shadow;
  shadow = shadow;
  field = mergeDeep({}, field, {
    borderColor: 'rgba(255, 255, 255, 0.12)',
    labelColor: 'rgba(255, 255, 255, 0.4)',
    appearance: {
      filled: {
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
        }
      }
    }
  });
  badge = {};
  checkbox = {
    unchecked: {
      color: 'rgba(255, 255, 255, 0.7)'
    }
  };
  snackBar = {
    root: {
      background: '#fafafa',
      color: 'rgba(0,0,0,.87)'
    }
  };
  tooltip = {
    root: {
      background: 'rgba(250, 250, 250, 0.85)',
      color: 'rgba(0,0,0,.87)'
    }
  };
  avatar = {};
}
