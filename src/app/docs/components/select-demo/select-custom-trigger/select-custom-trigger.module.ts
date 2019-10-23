import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LySelectModule } from '@alyle/ui/select';
import { LyIconModule } from '@alyle/ui/icon';
import { LyFieldModule } from '@alyle/ui/field';

import { SelectCustomTriggerComponent } from './select-custom-trigger.component';

@NgModule({
  declarations: [SelectCustomTriggerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyFieldModule,
    LySelectModule,
    LyIconModule
  ],
  exports: [SelectCustomTriggerComponent]
})
export class SelectCustomTriggerModule { }
