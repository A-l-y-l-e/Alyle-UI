import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowDemo01Component } from './shadow-demo-01.component';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  declarations: [ShadowDemo01Component],
  exports: [ShadowDemo01Component]
})
export class ShadowDemo01Module { }
