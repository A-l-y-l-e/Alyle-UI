import { typography, iconButton, icon, input } from './variables';
import { ThemeConfig } from '@alyle/ui';

const contrast = '#fff';
export class DefaultDark implements ThemeConfig {
  name = 'minDark';
  primary = {
    default: '#9c27b0',
    contrast
  };
  accent = {
    default: '#ffeb3b',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
  warn = {
    default: '#EA404C',
    contrast
  };
  typography = typography;
  background = {
    default: '#303030', // secondary
    primary: '#424242',
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
  menu = {
    bg: '#424242' // background>primary
  };
  drawer = {
    backdrop: 'rgba(49,49,49,.6)'
  };
  bar = '#212121';
  divider = 'rgba(255, 255, 255, 0.12)';
  colorShadow = 'rgba(0, 0, 0, 1)';
  input = {
    label: 'rgba(255, 255, 255, 0.4)',
    underline: 'rgba(255, 255, 255, 0.11)',
    withColor: input.withColor
  };
  iconButton = iconButton;
  icon = icon;
}
