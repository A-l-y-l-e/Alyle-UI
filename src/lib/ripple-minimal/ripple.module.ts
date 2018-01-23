import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyRipple } from './ripple.directive';
export * from './ripple.directive';
export * from './ripple';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LyRipple],
  exports: [LyRipple]
})
export class LyRippleModule { }
