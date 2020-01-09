import { NgModule } from '@angular/core';
import { MediaDirective } from './media.directive';
import { LyCommonModule } from '@alyle/ui';

/**
 * @deprecated use instead `[display]` or `[lyStyle]`
 */
@NgModule({
  declarations: [MediaDirective],
  exports: [MediaDirective, LyCommonModule],
})
export class ResponsiveModule { }
