import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LyInputModule } from 'alyle-ui/input';
import { LyButtonModule } from 'alyle-ui/button';

import { InputExample04Component } from './input-example-04.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LyInputModule,
    LyButtonModule
  ],
  exports: [InputExample04Component],
  declarations: [InputExample04Component]
})
export class InputExample04Module { }
