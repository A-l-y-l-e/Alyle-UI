import { NgModule } from '@angular/core';

import { LyCommon } from './common.directive';
import { LyWithClass } from './with-class.directive';

@NgModule({
  declarations: [LyCommon, LyWithClass],
  exports: [LyCommon, LyWithClass]
})
export class LyCommonModule { }
