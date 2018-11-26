import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';
import { LyBadgeModule } from '@alyle/ui/badge';
import { LyIconModule } from '@alyle/ui/icon';

import { ToolbarWithIconsComponent } from './toolbar-with-icons.component';

@NgModule({
  imports: [
    CommonModule,
    LyToolbarModule,
    LyTypographyModule,
    LyButtonModule,
    LyBadgeModule,
    LyIconModule
  ],
  exports: [ToolbarWithIconsComponent],
  declarations: [ToolbarWithIconsComponent]
})
export class ToolbarWithIconsModule { }
