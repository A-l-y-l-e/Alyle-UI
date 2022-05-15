import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyIconModule } from '@alyle/ui/icon';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyTypographyModule } from '@alyle/ui/typography';

import { AppBarComponent } from './app-bar.component';

@NgModule({
  declarations: [
    AppBarComponent
  ],
  imports: [
    CommonModule,
    LyToolbarModule,
    LyButtonModule,
    LyIconModule,
    LyMenuModule,
    LyTypographyModule
  ],
  exports: [AppBarComponent]
})
export class AppBarModule { }
