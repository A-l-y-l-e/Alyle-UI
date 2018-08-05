import { NgTranscludeModule } from '@alyle/ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabs, LyTabLabel, LyTab } from './tabs.directive';
import { LyHeaderPaginationModule } from '@alyle/ui/header-pagination';
import { LyRippleModule } from '@alyle/ui/ripple';
import { LyTabContent } from './tab-content.directive';

@NgModule({
  imports: [CommonModule, LyRippleModule, LyHeaderPaginationModule, NgTranscludeModule],
  exports: [LyTabs, LyTab, LyTabLabel, LyTabContent],
  declarations: [LyTabs, LyTab, LyTabLabel, LyTabContent]
})
export class LyTabsModule { }
