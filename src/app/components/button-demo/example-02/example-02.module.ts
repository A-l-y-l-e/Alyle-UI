import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@alyle/ui';
import { LyButtonModule } from '@alyle/ui/button';
import { Example02Component } from './example-02.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    LyButtonModule
  ],
  exports: [Example02Component],
  declarations: [Example02Component]
})
export class Example02Module { }
