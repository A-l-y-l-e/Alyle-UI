import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyCheckboxModule } from '@alyle/ui/checkbox';

import { SelectDisableComponent } from './select-disable.component';

@NgModule({
  declarations: [SelectDisableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LyFieldModule,
    LySelectModule,
    LyTypographyModule,
    LyCheckboxModule
  ],
  exports: [SelectDisableComponent]
})
export class SelectDisableModule { }
