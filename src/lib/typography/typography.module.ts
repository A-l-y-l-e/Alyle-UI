import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';

import { LyTypography } from './typography.directive';

@NgModule({
  exports: [LyTypography, LyCommonModule],
  declarations: [LyTypography]
})
export class LyTypographyModule { }
