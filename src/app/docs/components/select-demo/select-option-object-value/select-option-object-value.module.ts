import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTypographyModule } from '@alyle/ui/typography';

import { SelectOptionObjectValueComponent } from './select-option-object-value.component';

@NgModule({
  declarations: [SelectOptionObjectValueComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyFieldModule,
    LySelectModule,
    LyTypographyModule
  ],
  exports: [SelectOptionObjectValueComponent]
})
export class SelectOptionObjectValueModule { }
