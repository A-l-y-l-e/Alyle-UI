import { NgModule, Directive } from '@angular/core';
import { LY_THEME_NAME, LyTheme2 } from '@alyle/ui';
import { MinimaLight } from './light';
import { MinimaDark } from './dark';

@Directive({
  selector: '[ly-theme-minima-light]',
  providers: [ LyTheme2, { provide: LY_THEME_NAME, useValue: 'minima-light' } ]
})
export class ThemeMinimaLight { }

@Directive({
  selector: '[ly-theme-minima-dark]',
  providers: [ LyTheme2, { provide: LY_THEME_NAME, useValue: 'minima-dark' } ]
})
export class ThemeMinimaDark { }

@NgModule({
  declarations: [ThemeMinimaDark, ThemeMinimaLight],
  exports: [ThemeMinimaDark, ThemeMinimaLight]
})
export class ThemeMinimaModule {
  constructor() {
    console.warn(`ThemeMinimaModule is deprecated.`);
  }
}

export interface IMinimaTheme extends MinimaLight, MinimaDark { }
