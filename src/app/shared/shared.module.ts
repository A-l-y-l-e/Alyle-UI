import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyIconModule } from '@alyle/ui/icon';
import { AnalyticsService } from './analytics.service';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyIconModule
  ],
  exports: [],
  declarations: [],
  providers: [AnalyticsService]
})
export class SharedModule { }
