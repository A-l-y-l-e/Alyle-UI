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
 * LyStyle without prefixes
 */
@NgModule({
  declarations: [LyStyleDeprecated],
  exports: [LyStyleDeprecated]
})
export class LyCommonDeprecatedModule { }
