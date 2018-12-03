import { NgModule } from '@angular/core';
import { MediaDirective } from './media.directive';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  declarations: [MediaDirective],
  exports: [MediaDirective, LyCommonModule],
})
export class ResponsiveModule { }
