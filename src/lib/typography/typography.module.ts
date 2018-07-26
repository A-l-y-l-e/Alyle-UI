import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTypography } from './typography.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyTypography],
  declarations: [LyTypography]
})
export class LyTypographyModule { }
