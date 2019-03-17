import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTranscludeModule, LyExpansionIconModule } from '@alyle/ui';

import { LyAccordion } from './accordion';
import { LyExpansionPanel } from './expansion-panel';
import { LyExpansionPanelHeader } from './expansion-panel-header';
import { LyExpansionPanelContent } from './expansion-panel-content';
import { LyExpansionPanelTitle } from './expansion-panel-title';
import { LyExpansionPanelDescription } from './expansion-panel-description';
import { LyExpansionPanelAction } from './expansion-panel-action-row';

@NgModule({
  declarations: [
    LyAccordion,
    LyExpansionPanel,
    LyExpansionPanelHeader,
    LyExpansionPanelContent,
    LyExpansionPanelTitle,
    LyExpansionPanelDescription,
    LyExpansionPanelAction
  ],
  imports: [
    CommonModule,
    LyExpansionIconModule,
    NgTranscludeModule
  ],
  exports: [
    LyAccordion,
    LyExpansionPanel,
    LyExpansionPanelHeader,
    LyExpansionPanelContent,
    LyExpansionPanelTitle,
    LyExpansionPanelDescription,
    LyExpansionPanelAction
  ]
})
export class LyExpansionModule { }
