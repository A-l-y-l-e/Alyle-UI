import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';

import { SelectMultipleComponent } from './select-multiple.component';

@NgModule({
  declarations: [SelectMultipleComponent],
  imports: [
    CommonModule,
    FormsModule,
    LyFieldModule,
    LySelectModule
  ],
  exports: [SelectMultipleComponent]
})
export class SelectMultipleModule { }
