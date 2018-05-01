import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { BgColorDemo01Component } from './bg-color-demo-01.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule
  ],
  exports: [BgColorDemo01Component],
  declarations: [BgColorDemo01Component]
})
export class BgColorDemo01Module { }
