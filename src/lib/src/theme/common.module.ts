import { NgModule } from '@angular/core';

import { LyPaper } from './paper';
import { LyWithClass } from './with-class.directive';
import { LyStyle, LyStyleDeprecated } from './style.directive';

@NgModule({
  declarations: [LyStyle, LyWithClass, LyPaper, LyStyleDeprecated],
  exports: [LyStyle, LyWithClass, LyPaper, LyStyleDeprecated]
})
export class LyCommonModule { }

