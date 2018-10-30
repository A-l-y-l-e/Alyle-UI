import { field } from './variables';
import { ThemeConfig, mergeDeep, Dir } from '@alyle/ui';
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
  text = {
    default: '#fff',
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.70)',
    disabled: 'rgba(255, 255, 255, 0.50)',
    hint: 'rgba(255, 255, 255, 0.50)'
  };
  /** Components variables */
  button = {
    disabled: 'rgba(255, 255, 255, 0.30)'
  };
  radio = {
    radioOuterCircle: 'rgba(255, 255, 255, 0.55)'
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
    appearance: {
      filled: {
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
        }
      }
    }
  });
  input = {
    /** @deprecated */
    label: 'rgba(255, 255, 255, 0.4)',
    /** @deprecated */
    underline: 'rgba(255, 255, 255, 0.11)',
  };
  badge = {};
  // direction = Dir.rtl;
}
