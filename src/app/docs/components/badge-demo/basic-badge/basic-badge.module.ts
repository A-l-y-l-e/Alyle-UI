import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicBadgeComponent } from './basic-badge.component';
import { LyBadgeModule } from '@alyle/ui/badge';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyBadgeModule,
    LyButtonModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [BasicBadgeComponent],
  declarations: [BasicBadgeComponent]
})
export class BasicBadgeModule { }
