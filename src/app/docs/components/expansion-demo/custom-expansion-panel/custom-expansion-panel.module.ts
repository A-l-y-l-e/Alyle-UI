import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyExpansionIconModule } from '@alyle/ui';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';

import { CustomExpansionPanelComponent } from './custom-expansion-panel.component';

@NgModule({
  declarations: [CustomExpansionPanelComponent],
  imports: [
    CommonModule,
    LyExpansionModule,
    LyTypographyModule,
    LyButtonModule,
    LyExpansionIconModule
  ],
  exports: [CustomExpansionPanelComponent]
})
export class CustomExpansionPanelModule { }
