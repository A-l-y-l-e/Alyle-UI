import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyBadge } from './badge';

@NgModule({
  exports: [LyBadge, LyCommonModule],
  declarations: [LyBadge]
})
export class LyBadgeModule { }
