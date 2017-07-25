import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  LyButtonModule,
  LyIconButtonModule,
  LySvgModule
} from 'alyle-ui';

import { ButtonExample03Component } from './button-example-03.component';

@NgModule({
  imports: [
    CommonModule,
    LyButtonModule,
    LyIconButtonModule,
    LySvgModule
  ],
  exports: [ButtonExample03Component],
  declarations: [ButtonExample03Component]
})
export class ButtonExample03Module { }
