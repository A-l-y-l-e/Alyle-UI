import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { Example02Component } from './example-02.component';
import { LyFlexModule } from '@alyle/ui/flex';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyButtonModule,
    LyIconModule,
    LyFlexModule
  ],
  exports: [Example02Component],
  declarations: [Example02Component]
})
export class Example02Module { }
