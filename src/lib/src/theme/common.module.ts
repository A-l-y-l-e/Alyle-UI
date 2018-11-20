import { NgModule } from '@angular/core';

import { LyPaper } from './common.directive';
import { LyWithClass } from './with-class.directive';

@NgModule({
  declarations: [LyWithClass, LyPaper],
  exports: [LyWithClass, LyPaper]
})
export class LyCommonModule { }
