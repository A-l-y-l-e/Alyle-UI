import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTab, LyTabGroupComponent, LyTabContent } from './tabs';
import { LyHeaderPaginationModule } from '../header-pagination/index';
import { LyRippleModule } from '../ripple/index';
import { NgTranscludeModule } from '../core/minimal/common';
import { LyTabLabelDirective } from './tab-label.directive';
export * from './tabs';
export * from './tab-label.directive';

@NgModule({
  imports: [CommonModule, LyRippleModule, LyHeaderPaginationModule, NgTranscludeModule],
  exports: [LyTab, LyTabGroupComponent, LyTabLabelDirective, LyTabContent],
  declarations: [LyTab, LyTabGroupComponent, LyTabLabelDirective, LyTabContent],
})
export class LyTabsModule { }
