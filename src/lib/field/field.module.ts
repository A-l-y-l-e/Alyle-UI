import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyField, LyInputNative } from './field';
import { LyPlaceholder } from './placeholder';
import { LyLabel } from './label';
import { LyPrefix } from './prefix';
import { LySuffix } from './suffix';
import { LyHint } from './hint';
import { LyError } from './error';

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
    LyPrefix,
    LySuffix,
    LyHint,
    LyError,
    LyCommonModule
  ],
  declarations: [ LyField, LyPlaceholder, LyLabel, LyInputNative, LyPrefix, LySuffix, LyHint, LyError ]
})
export class LyFieldModule { }
