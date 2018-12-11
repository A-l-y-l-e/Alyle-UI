import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';

import { TabsWithIconComponent } from './tabs-with-icon.component';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule,
    LyIconModule,
    LyTypographyModule
  ],
  exports: [TabsWithIconComponent],
  declarations: [TabsWithIconComponent]
})
export class TabsWithIconModule { }
