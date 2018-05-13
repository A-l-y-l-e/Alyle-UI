import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyCommonModule } from '@alyle/ui';
import { LyInputModule } from '@alyle/ui/input';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyRadioModule } from '@alyle/ui/radio';

import { InputExample05Component } from './input-example-05.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule,
    LyInputModule,
    LyButtonModule,
    LyIconButtonModule,
    LyIconModule,
    LyRadioModule
  ],
  exports: [InputExample05Component],
  declarations: [InputExample05Component]
})
export class InputExample05Module { }
