import { NgModule } from '@angular/core';

import { LyPaper } from './paper';
import { LyWithClass } from './with-class.directive';
import { LyStyle, LyStyleDeprecated } from './style.directive';

/**
 * @deprecated
 */
@NgModule({
  declarations: [LyStyle, LyWithClass, LyPaper],
  exports: [LyStyle, LyWithClass, LyPaper]
})
export class LyCommonModule { }

@NgModule({
  exports: [LyStyleDeprecated],
  declarations: [LyStyleDeprecated]
})
export class LyStyleDeprecatedModule { }

