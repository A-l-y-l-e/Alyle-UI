import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyFocusStateModule } from '@alyle/ui';
import { LyRippleModule } from '@alyle/ui/ripple';
import { RippleDemo01Component } from './ripple-demo-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyRippleModule,
    LyFocusStateModule
  ],
  exports: [RippleDemo01Component],
  declarations: [RippleDemo01Component]
})
export class RippleDemo01Module { }
