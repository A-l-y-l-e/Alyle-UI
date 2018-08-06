import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTranscludeModule } from '@alyle/ui';
import { LyRippleModule } from '@alyle/ui/ripple';
// import { LyHeaderPaginationModule } from '@alyle/ui/header-pagination';
import { LyTabs, LyTabLabel, LyTab } from './tabs.directive';
import { LyTabContent } from './tab-content.directive';

@NgModule({
  imports: [CommonModule, LyRippleModule, NgTranscludeModule],
  exports: [LyTabs, LyTab, LyTabLabel, LyTabContent],
  declarations: [LyTabs, LyTab, LyTabLabel, LyTabContent]
})
export class LyTabsModule { }
