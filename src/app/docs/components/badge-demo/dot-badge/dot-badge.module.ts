import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyBadgeModule } from '@alyle/ui/badge';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyTypographyModule } from '@alyle/ui/typography';

import { DotBadgeComponent } from './dot-badge.component';

@NgModule({
  declarations: [DotBadgeComponent],
  imports: [
    CommonModule,
    LyBadgeModule,
    LyButtonModule,
    LyIconModule,
    LyTypographyModule
  ],
  exports: [DotBadgeComponent]
})
export class DotBadgeModule { }
