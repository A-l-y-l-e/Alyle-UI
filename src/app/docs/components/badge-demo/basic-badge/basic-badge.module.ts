import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicBadgeComponent } from './basic-badge.component';
import { LyBadgeModule } from '@alyle/ui/badge';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  imports: [
    CommonModule,
    LyButtonModule,
    LyBadgeModule
  ],
  exports: [BasicBadgeComponent],
  declarations: [BasicBadgeComponent]
})
export class BasicBadgeModule { }
