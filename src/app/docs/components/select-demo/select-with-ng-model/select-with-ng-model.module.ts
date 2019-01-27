import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTypographyModule } from '@alyle/ui/typography';

import { SelectWithNgModelComponent } from './select-with-ng-model.component';

@NgModule({
  declarations: [SelectWithNgModelComponent],
  imports: [
    CommonModule,
    FormsModule,
    LyFieldModule,
    LySelectModule,
    LyTypographyModule
  ],
  exports: [SelectWithNgModelComponent]
})
export class SelectWithNgModelModule { }
