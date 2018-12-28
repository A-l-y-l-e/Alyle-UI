import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyTypographyModule } from '@alyle/ui/typography';

import { RadioExample01Component } from './radio-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyRadioModule,
    LyTypographyModule
  ],
  exports: [RadioExample01Component],
  declarations: [RadioExample01Component]
})
export class RadioExample01Module { }
