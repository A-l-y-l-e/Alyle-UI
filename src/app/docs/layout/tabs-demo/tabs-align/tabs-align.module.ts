import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';

import { TabsAlignComponent } from './tabs-align.component';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule,
    LyTypographyModule
  ],
  exports: [TabsAlignComponent],
  declarations: [TabsAlignComponent]
})
export class TabsAlignModule { }
