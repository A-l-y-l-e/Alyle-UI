import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

import { BasicTooltipComponent } from './basic-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    LyTooltipModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [BasicTooltipComponent],
  declarations: [BasicTooltipComponent]
})
export class BasicTooltipModule { }
