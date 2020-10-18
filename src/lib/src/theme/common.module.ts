import { NgModule } from '@angular/core';

import { LyPaper } from './paper';
import { LyWithClass } from './with-class.directive';
import { LyStyle, LyStyleDeprecated } from './style.directive';

@NgModule({
  declarations: [LyStyle, LyWithClass, LyPaper],
  exports: [LyStyle, LyWithClass, LyPaper]
})
export class LyCommonModule { }

/**
 * @deprecated
 */
@NgModule({
  exports: [LyStyleDeprecated],
  declarations: [LyStyleDeprecated]
})
export class LyStyleDeprecatedModule { }

