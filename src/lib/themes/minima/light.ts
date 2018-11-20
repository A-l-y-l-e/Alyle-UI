import { ThemeConfig, mergeDeep, Dir } from '@alyle/ui';
import { field } from './variables';
import { MinimaBase } from './base';

const contrast = '#fff';
const shadow = '#333';
export class MinimaLight extends MinimaBase implements ThemeConfig {
  name = 'minima-light';
  primary = {
    default: '#6200EE',
    contrast
  };
  accent = {
    default: '#FF2997',
    contrast
  };
  warn = {
    default: '#f5414e',
    contrast
  };
  disabled = 'rgba(0, 0, 0, 0.11)';
  background = {
    default: '#fafafa', // secondary
    primary: {
      default: '#fff',
      shadow
    },
    secondary: '#fafafa',
    tertiary: '#f5f6f7',
    base: '#E0E0E0'
  };
  text = {
    default: 'rgba(0, 0, 0, 0.87)',
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.54)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)'
  };
  divider = 'rgba(0, 0, 0, 0.12)';
  colorShadow = '#333';
  shadow = '#333';
  /** Components variables */
  radio = {
    radioOuterCircle: 'rgba(0, 0, 0, 0.43)'
  };
  menu = {};
  drawer = {
    backdrop: 'rgba(0,0,0,.6)'
  };
  bar = '#f5f5f5';
  field = mergeDeep({}, field, {
    borderColor: 'rgba(0, 0, 0, 0.12)',
    labelColor: 'rgba(0, 0, 0, 0.6)',
    appearance: {
      filled: {
        container: {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
      }
    }
  });
  badge = {};
  checkbox = {
    unchecked: {
      color: 'rgba(0, 0, 0, .54)'
    }
  };
  snackBar = {
    root: {
      background: '#323232',
      color: 'rgba(255,255,255,.7)'
    }
  };
}
