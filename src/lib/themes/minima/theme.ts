import { NgModule, Directive } from '@angular/core';
import { LyThemeConfig, LY_THEME_NAME, LyTheme2 } from '@alyle/ui';
import { MinimaLight } from './light';
import { MinimaDark } from './dark';

export class MinimaTheme implements LyThemeConfig {
  themes = [MinimaLight, MinimaDark];
}

@Directive({
  selector: '[ly-theme-minima-light]',
  providers: [
    LyTheme2,
    { provide: LY_THEME_NAME, useValue: 'minima-light' }
  ]
})
export class ThemeMinimaLight { }

@Directive({
  selector: '[ly-theme-minima-dark]',
  providers: [
    LyTheme2,
    { provide: LY_THEME_NAME, useValue: 'minima-dark' }
  ]
})
export class ThemeMinimaDark { }

@NgModule({
  declarations: [ThemeMinimaLight, ThemeMinimaDark],
  exports: [ThemeMinimaLight, ThemeMinimaDark]
})
export class MinimaThemeModule {}

export interface IMinimaTheme extends MinimaLight, MinimaDark { }
