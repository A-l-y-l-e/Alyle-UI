import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyColor } from './color.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyColor],
  declarations: [LyColor]
})
export class ColorModule { }
export * from './color.directive';
