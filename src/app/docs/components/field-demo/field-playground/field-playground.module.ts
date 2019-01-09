import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyIconModule } from '@alyle/ui/icon';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyGridModule } from '@alyle/ui/grid';

import { FieldPlaygroundComponent } from './field-playground.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LyFieldModule,
    LyRadioModule,
    LyIconModule,
    LyButtonModule,
    LyCheckboxModule,
    LyGridModule
  ],
  exports: [FieldPlaygroundComponent],
  declarations: [FieldPlaygroundComponent]
})
export class FieldPlaygroundModule { }
