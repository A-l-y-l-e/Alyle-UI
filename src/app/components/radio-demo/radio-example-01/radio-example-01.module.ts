import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyRadioModule } from 'alyle-ui/radio';

import { RadioExample01Component } from './radio-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyRadioModule
  ],
  exports: [RadioExample01Component],
  declarations: [RadioExample01Component]
})
export class RadioExample01Module { }
