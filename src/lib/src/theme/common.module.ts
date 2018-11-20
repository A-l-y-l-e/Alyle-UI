import { NgModule } from '@angular/core';

import { LyCommon } from './common.directive';
import { LyWithClass } from './with-class.directive';

@NgModule({
  declarations: [LyWithClass],
  exports: [LyWithClass]
})
export class LyCommonModule { }
