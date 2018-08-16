import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTranscludeModule, LyCommonModule, LyThemeModule } from '@alyle/ui';
import { LyRippleModule } from '@alyle/ui/ripple';
import { LyTabs, LyTabLabel, LyTab } from './tabs.directive';
import { LyTabContent } from './tab-content.directive';

@NgModule({
  imports: [LyThemeModule, CommonModule, LyCommonModule, LyRippleModule, NgTranscludeModule],
  exports: [LyTabs, LyTab, LyTabLabel, LyTabContent],
  declarations: [LyTabs, LyTab, LyTabLabel, LyTabContent]
})
export class LyTabsModule { }
