import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyInputModule } from 'alyle-ui';

import { InputDemoExample02Component } from './input-demo-example-02.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyInputModule
  ],
  exports: [InputDemoExample02Component],
  declarations: [InputDemoExample02Component]
})
export class InputDemoExample02Module { }
