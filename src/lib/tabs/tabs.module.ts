import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTab, LyTabGroupComponent, LyTabContent } from './tabs';
import { LyHeaderPaginationModule } from 'alyle-ui/header-pagination';
import { LyRippleModule } from 'alyle-ui/ripple-minimal';
import { NgTranscludeModule } from 'alyle-ui/core';
import { LyTabLabelDirective } from './tab-label.directive';

@NgModule({
  imports: [CommonModule, LyRippleModule, LyHeaderPaginationModule, NgTranscludeModule],
  exports: [LyTab, LyTabGroupComponent, LyTabLabelDirective, LyTabContent],
  declarations: [LyTab, LyTabGroupComponent, LyTabLabelDirective, LyTabContent]
})
export class LyTabsModule { }
