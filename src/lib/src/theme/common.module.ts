import { NgModule } from '@angular/core';

import { LyPaper } from './paper';
import { LyWithClass } from './with-class.directive';
import { LyStyle } from './style.directive';

@NgModule({
  declarations: [LyStyle, LyWithClass, LyPaper],
  exports: [LyStyle, LyWithClass, LyPaper]
})
export class LyCommonModule { }
