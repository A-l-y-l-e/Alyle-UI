import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyGridModule } from '@alyle/ui/grid';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyButtonModule } from '@alyle/ui/button';

import { SimpleFormComponent } from './simple-form.component';

@NgModule({
  declarations: [SimpleFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyGridModule,
    LyFieldModule,
    LySelectModule,
    LyButtonModule
  ],
  exports: [SimpleFormComponent]
})
export class SimpleFormModule { }
