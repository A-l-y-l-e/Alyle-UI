import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyCoreModule } from 'alyle-ui';
import { LyInputModule } from 'alyle-ui/input';
import { LyButtonModule } from 'alyle-ui/button';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';
import { LyRadioModule } from 'alyle-ui/radio';

import { InputExample04Component } from './input-example-04.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCoreModule,
    LyInputModule,
    LyIconButtonModule,
    LySvgModule,
    LyButtonModule,
    LyRadioModule
  ],
  exports: [InputExample04Component],
  declarations: [InputExample04Component]
})
export class InputExample04Module { }
