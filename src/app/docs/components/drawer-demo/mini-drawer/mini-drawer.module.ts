import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyListModule } from '@alyle/ui/list';
import { LyButtonModule } from '@alyle/ui/button';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyIconModule } from '@alyle/ui/icon';
import { ResponsiveModule } from '@alyle/ui/responsive';

import { MiniDrawerComponent } from './mini-drawer.component';

@NgModule({
  declarations: [MiniDrawerComponent],
  imports: [
    CommonModule,
    LyDrawerModule,
    LyToolbarModule,
    LyListModule,
    LyButtonModule,
    LyRadioModule,
    LyTypographyModule,
    LyIconModule,
    ResponsiveModule
  ],
  exports: [
    MiniDrawerComponent
  ]
})
export class MiniDrawerModule { }
