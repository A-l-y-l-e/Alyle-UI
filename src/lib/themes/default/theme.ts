import { ThemeConfig, LyThemeConfig } from '@alyle/ui';
import { DefaultLight } from './light';
import { DefaultDark } from './dark';

export class DefaultTheme implements LyThemeConfig {
  themes = [DefaultLight, DefaultDark];
}

