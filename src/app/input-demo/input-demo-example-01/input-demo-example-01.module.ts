import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlyleUIModule, LyInputModule } from 'alyle-ui';

import { InputDemoExample01Component } from './input-demo-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlyleUIModule,
    LyInputModule
  ],
  exports: [InputDemoExample01Component],
  declarations: [InputDemoExample01Component]
})
export class InputDemoExample01Module { }
