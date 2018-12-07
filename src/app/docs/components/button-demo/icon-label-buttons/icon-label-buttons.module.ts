import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

import { IconLabelButtonsComponent } from './icon-label-buttons.component';

@NgModule({
  imports: [
    CommonModule,
    LyGridModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [IconLabelButtonsComponent],
  declarations: [IconLabelButtonsComponent]
})
export class IconLabelButtonsModule { }
