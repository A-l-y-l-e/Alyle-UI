import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  LyInputModule,
  LyIconButtonModule,
  LySvgModule
} from 'alyle-ui';

import { InputDemoExample03Component } from './input-demo-example-03.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyInputModule,
    LyIconButtonModule,
    LySvgModule
  ],
  exports: [InputDemoExample03Component],
  declarations: [InputDemoExample03Component]
})
export class InputDemoExample03Module { }
