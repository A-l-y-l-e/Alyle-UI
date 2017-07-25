import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  LyButtonModule,
  LyIconButtonModule,
  LySvgModule
} from 'alyle-ui';

import { ButtonExample04Component } from './button-example-04.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyButtonModule,
    LyIconButtonModule,
    LySvgModule
  ],
  exports: [ButtonExample04Component],
  declarations: [ButtonExample04Component]
})
export class ButtonExample04Module { }
