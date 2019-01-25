import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTypographyModule } from '@alyle/ui/typography';

import { SelectReactiveFormComponent } from './select-reactive-form.component';

@NgModule({
  declarations: [SelectReactiveFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyFieldModule,
    LySelectModule,
    LyTypographyModule
  ],
  exports: [SelectReactiveFormComponent]
})
export class SelectReactiveFormModule { }
