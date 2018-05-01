import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleThemesDemo01Component } from './multiple-themes-demo-01.component';
import { AlyleUIModule } from '@alyle/ui';
import { LyCommonModule } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    RouterModule,
    LyCommonModule,
    AlyleUIModule.forChild({
      name: 'darkTheme',
      scheme: 'dark'
    }),
    LyButtonModule
  ],
  declarations: [MultipleThemesDemo01Component],
  exports: [MultipleThemesDemo01Component]
})
export class MultipleThemesDemo01Module { }
