import { NgModule } from '@angular/core';
import { LyTooltip } from './tooltip';
import { LyOverlayModule } from '@alyle/ui';

@NgModule({
  imports: [LyOverlayModule],
  declarations: [LyTooltip],
  exports: [LyTooltip]
})
export class LyTooltipModule { }
