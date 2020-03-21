import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabsModule } from '@alyle/ui/tabs';

import { TabsDynamicHeightComponent } from './tabs-dynamic-height.component';



@NgModule({
  declarations: [TabsDynamicHeightComponent],
  imports: [
    CommonModule,
    LyTabsModule
  ],
  exports: [TabsDynamicHeightComponent]
})
export class TabsDynamicHeightModule { }
