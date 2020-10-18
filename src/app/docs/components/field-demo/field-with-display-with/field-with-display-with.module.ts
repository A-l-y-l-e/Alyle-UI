import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';

import { FieldWithDisplayWithComponent } from './field-with-display-with.component';



@NgModule({
  declarations: [FieldWithDisplayWithComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyFieldModule,
  ]
})
export class FieldWithDisplayWithModule { }
