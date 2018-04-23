import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleThemesDemo01Component } from './multiple-themes-demo-01.component';
import { AlyleUIModule } from 'alyle-ui';
import { ThemeModule } from 'alyle-ui/core';
import { LyButtonModule } from 'alyle-ui/button';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    AlyleUIModule.forChild({
      primary: 'pink',
      accent: 'purple',
      colorScheme: 'dark'
    }),
    LyButtonModule
  ],
  declarations: [MultipleThemesDemo01Component],
  exports: [MultipleThemesDemo01Component]
})
export class MultipleThemesDemo01Module { }
