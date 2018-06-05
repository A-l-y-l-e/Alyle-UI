import { typography, iconButton, icon, input } from './variables';
import { ThemeConfig } from '@alyle/ui';

const contrast = '#fff';
export class DefaultLight implements ThemeConfig {
  name = 'minLight';
  primary = {
    default: '#2CA7F8',
    contrast
  };
  accent = {
    default: '#FF2997',
    contrast
  };
  warn = {
    default: '#EA404C',
    contrast
  };
  typography = typography;
  background = {
    default: '#fafafa', // secondary
    primary: '#fff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
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
  colorShadow = '#777777';
  /** Components variables */
  button = {
    disabled: 'rgba(0, 0, 0, 0.11)'
  };
  radio = {
    radioOuterCircle: 'rgba(0, 0, 0, 0.43)'
  };
  menu = {
    bg: '#fff' // background>primary
  };
  drawer = {
    backdrop: 'rgba(0,0,0,.6)'
  };
  bar = '#f5f5f5';
  input = {
    label: 'rgba(0, 0, 0, 0.4)',
    underline: 'rgba(0, 0, 0, 0.11)',
    /** default color */
    withColor: input.withColor
  };
  iconButton = iconButton;
  icon = icon;
}
