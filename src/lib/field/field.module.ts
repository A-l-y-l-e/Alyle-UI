import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyField } from './field';
import { LyInputNative } from './input';
import { LyPlaceholder } from './placeholder';
import { LyLabel } from './label';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyField,
    LyPlaceholder,
    LyLabel,
    LyInputNative,
    LyCommonModule
  ],
  declarations: [ LyField, LyPlaceholder, LyLabel, LyInputNative ]
})
export class LyFieldModule { }
