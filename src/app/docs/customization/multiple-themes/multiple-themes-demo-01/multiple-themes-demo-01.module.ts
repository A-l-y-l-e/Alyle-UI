import { NgModule, Directive, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule, LY_THEME_NAME, LY_THEME, LyTheme2, StyleRenderer, lyl, RecursivePartial, LY_THEME_GLOBAL_VARIABLES } from '@alyle/ui';
import { LyButtonModule, LyButtonTheme } from '@alyle/ui/button';
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

export class CustomGlobalVariables implements RecursivePartial<MinimaLight & MinimaDark> {
  button: LyButtonTheme = {
    root: __ => lyl `{
      border-radius: 2em
    }`
  };
}

@Directive({
  selector: '[with-minima-light]',
  providers: [
    LyTheme2,
    StyleRenderer,
    { provide: LY_THEME_NAME, useValue: 'new-minima-light' }
  ],
  standalone: false
})
export class WithLightTheme { }

@Directive({
  selector: '[with-minima-dark]',
  providers: [
    LyTheme2,
    StyleRenderer,
    { provide: LY_THEME_NAME, useValue: 'new-minima-dark' }
  ],
  standalone: false
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
    { provide: LY_THEME, useClass: NewMinimaDark, multi: true },
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: CustomGlobalVariables },
  ]
})
export class MultipleThemesDemo01Module { }
