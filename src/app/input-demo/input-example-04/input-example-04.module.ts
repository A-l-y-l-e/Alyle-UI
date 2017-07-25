import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AlyleUIModule,
  LyInputModule,
  LyIconButtonModule,
  LySvgModule,
  LyButtonModule,
  LyRadioModule } from 'alyle-ui';

import { InputExample04Component } from './input-example-04.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlyleUIModule,
    LyInputModule,
    LyIconButtonModule,
    LySvgModule,
    LyButtonModule,
    LyRadioModule
  ],
  exports: [InputExample04Component],
  declarations: [InputExample04Component]
})
export class InputExample04Module { }
