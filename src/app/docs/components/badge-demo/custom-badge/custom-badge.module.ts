import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyGridModule } from '@alyle/ui/grid';
import { LyBadgeModule } from '@alyle/ui/badge';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyAvatarModule } from '@alyle/ui/avatar';

import { CustomBadgeComponent } from './custom-badge.component';

@NgModule({
  declarations: [CustomBadgeComponent],
  imports: [
    CommonModule,
    LyGridModule,
    LyBadgeModule,
    LyButtonModule,
    LyIconModule,
    LyAvatarModule
  ],
  exports: [CustomBadgeComponent]
})
export class CustomBadgeModule { }
