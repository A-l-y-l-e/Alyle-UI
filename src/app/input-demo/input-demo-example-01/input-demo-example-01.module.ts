import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyCoreModule } from 'alyle-ui';
import { LyInputModule } from 'alyle-ui/input';

import { InputDemoExample01Component } from './input-demo-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCoreModule,
    LyInputModule
  ],
  exports: [InputDemoExample01Component],
  declarations: [InputDemoExample01Component]
})
export class InputDemoExample01Module { }
