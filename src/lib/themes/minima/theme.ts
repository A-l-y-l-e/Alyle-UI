import { ThemeConfig, LyThemeConfig } from '@alyle/ui';
import { MinimaLight } from './light';
import { MinimaDark } from './dark';

export class MinimaTheme implements LyThemeConfig {
  themes = [MinimaLight, MinimaDark];
}

export interface IMinimaTheme extends MinimaLight, MinimaDark { }
