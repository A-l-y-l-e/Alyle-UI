import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleThemesDemo01Component } from './multiple-themes-demo-01.component';
import { LyCommonModule } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { ThemeMinimaModule } from '@alyle/ui/themes/minima';
import { LyCardModule } from '@alyle/ui/card';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    ThemeMinimaModule, // <-- import theme module
    LyCommonModule,
    LyCardModule,
    LyButtonModule
  ],
  declarations: [MultipleThemesDemo01Component],
  exports: [MultipleThemesDemo01Component]
})
export class MultipleThemesDemo01Module { }
