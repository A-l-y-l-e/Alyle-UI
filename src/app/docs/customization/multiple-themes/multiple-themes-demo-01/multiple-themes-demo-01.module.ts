import { NgModule, Directive, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule, LY_THEME_NAME, LY_THEME, LyTheme2, StyleRenderer } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCardModule } from '@alyle/ui/card';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

import { MultipleThemesDemo01Component } from './multiple-themes-demo-01.component';

@Injectable()
export class NewMinimaLight extends MinimaLight {
  name = 'new-minima-light';
}
@Injectable()
export class NewMinimaDark extends MinimaDark {
  name = 'new-minima-dark';
}

@Directive({
  selector: '[with-minima-light]',
  providers: [
    LyTheme2,
    StyleRenderer,
    { provide: LY_THEME_NAME, useValue: 'new-minima-light' }
  ]
})
export class WithLightTheme { }

@Directive({
  selector: '[with-minima-dark]',
  providers: [
    LyTheme2,
    StyleRenderer,
    { provide: LY_THEME_NAME, useValue: 'new-minima-dark' }
  ]
})
export class WithDarkTheme { }

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyCardModule,
    LyButtonModule
  ],
  declarations: [
    MultipleThemesDemo01Component,
    WithLightTheme,
    WithDarkTheme
  ],
  exports: [MultipleThemesDemo01Component],
  providers: [
    { provide: LY_THEME, useClass: NewMinimaLight, multi: true },
    { provide: LY_THEME, useClass: NewMinimaDark, multi: true }
  ]
})
export class MultipleThemesDemo01Module { }
