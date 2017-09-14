import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyInputModule } from 'alyle-ui/input';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';

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
