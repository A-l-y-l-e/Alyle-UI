import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconModule } from '@alyle/ui/icon';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyDividerModule } from '@alyle/ui/divider';

import { MenuWithIconsComponent } from './menu-with-icons.component';



@NgModule({
  declarations: [MenuWithIconsComponent],
  imports: [
    CommonModule,
    LyMenuModule,
    LyIconModule,
    LyButtonModule,
    LyTypographyModule,
    LyDividerModule
  ],
  exports: [MenuWithIconsComponent]
})
export class MenuWithIconsModule { }
