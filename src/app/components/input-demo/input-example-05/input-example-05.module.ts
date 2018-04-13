import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ThemeModule } from 'alyle-ui/core';
import { LyInputModule } from 'alyle-ui/input';
import { LyButtonModule } from 'alyle-ui/button';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';
import { LyRadioModule } from 'alyle-ui/radio';

import { InputExample05Component } from './input-example-05.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    LyInputModule,
    LyButtonModule,
    LyIconButtonModule,
    LySvgModule,
    LyRadioModule
  ],
  exports: [InputExample05Component],
  declarations: [InputExample05Component]
})
export class InputExample05Module { }
