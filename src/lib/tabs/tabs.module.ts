import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTranscludeModule, LyCommonModule, LyThemeModule } from '@alyle/ui';
import { LyTabs, LyTabLabel, LyTab } from './tabs';
import { LyTabContent } from './tab-content.directive';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    LyThemeModule,
    CommonModule,
    LyCommonModule,
    NgTranscludeModule,
    PortalModule
  ],
  exports: [LyCommonModule, LyTabs, LyTab, LyTabLabel, LyTabContent],
  declarations: [LyTabs, LyTab, LyTabLabel, LyTabContent]
})
export class LyTabsModule { }
