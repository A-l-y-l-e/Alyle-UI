import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyField } from './field';
import { LyInputNative } from './input';

@NgModule({
  imports: [
    LyCommonModule
  ],
  exports: [
    LyField,
    LyInputNative,
    LyCommonModule
  ],
  declarations: [ LyField, LyInputNative ]
})
export class LyFieldModule { }
