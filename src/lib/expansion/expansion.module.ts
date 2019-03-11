import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTranscludeModule, LyExpansionIconModule } from '@alyle/ui';

import { LyAccordion } from './accordion';
import { LyExpansionPanel } from './expansion-panel';
import { LyExpansionPanelHeader } from './expansion-panel-header';
import { LyExpansionPanelContent } from './expansion-panel-content';

@NgModule({
  declarations: [
    LyAccordion,
    LyExpansionPanel,
    LyExpansionPanelHeader,
    LyExpansionPanelContent,
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
    LyExpansionPanelContent
  ]
})
export class LyExpansionModule { }
