import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyField, LyNativeControl, STYLES } from './field';
import { LyPlaceholder } from './placeholder';
import { LyLabel } from './label';
import { LyPrefix } from './prefix';
import { LySuffix } from './suffix';
import { LyHint } from './hint';
import { LyError } from './error';
import { LY_FIELD_STYLES_TOKEN } from './field-styles-token';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyField,
    LyPlaceholder,
    LyLabel,
    LyNativeControl,
    LyPrefix,
    LySuffix,
    LyHint,
    LyError,
    LyCommonModule
  ],
  providers: [
    {
      provide: LY_FIELD_STYLES_TOKEN,
      useValue: STYLES
    }
  ],
  declarations: [ LyField, LyPlaceholder, LyLabel, LyNativeControl, LyPrefix, LySuffix, LyHint, LyError ]
})
export class LyFieldModule { }
