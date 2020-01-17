import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';

import { LyIcon } from './icon';

@NgModule({
  declarations: [LyIcon],
  exports: [LyIcon, LyCommonModule]
})
export class LyIconModule { }
