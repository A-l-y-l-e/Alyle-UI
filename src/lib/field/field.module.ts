import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyField } from './field';

@NgModule({
  imports: [
    LyCommonModule
  ],
  exports: [
    LyField,
    LyCommonModule
  ],
  declarations: [ LyField ]
})
export class LyFieldModule { }
