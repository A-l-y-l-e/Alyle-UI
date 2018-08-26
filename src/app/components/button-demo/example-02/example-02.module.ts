import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { Example02Component } from './example-02.component';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [Example02Component],
  declarations: [Example02Component]
})
export class Example02Module { }
