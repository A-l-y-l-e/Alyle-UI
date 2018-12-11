import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyTypographyModule } from '@alyle/ui/typography';

import { TabsPlacementComponent } from './tabs-placement.component';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule,
    LyRadioModule,
    LyTypographyModule
  ],
  exports: [TabsPlacementComponent],
  declarations: [TabsPlacementComponent]
})
export class TabsPlacementModule { }
