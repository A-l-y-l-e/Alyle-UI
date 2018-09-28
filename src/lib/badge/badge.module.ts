import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyBadge } from './badge';

@NgModule({
  imports: [CommonModule, LyCommonModule],
  exports: [LyBadge, LyCommonModule],
  declarations: [LyBadge]
})
export class LyBadgeModule { }
