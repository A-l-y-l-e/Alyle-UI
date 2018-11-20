import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { Icon } from './icon';

@NgModule({
  declarations: [Icon],
  exports: [Icon, LyCommonModule]
})
export class LyIconModule { }
