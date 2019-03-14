import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyTypographyModule } from '@alyle/ui/typography';

import { CustomExpansionPanelComponent } from './custom-expansion-panel.component';

@NgModule({
  declarations: [CustomExpansionPanelComponent],
  imports: [
    CommonModule,
    LyExpansionModule,
    LyTypographyModule
  ],
  exports: [CustomExpansionPanelComponent]
})
export class CustomExpansionPanelModule { }
