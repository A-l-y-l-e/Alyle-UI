import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

import { SimpleFormComponent } from './simple-form.component';

@NgModule({
  declarations: [SimpleFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyFieldModule,
    LySelectModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [SimpleFormComponent]
})
export class SimpleFormModule { }
