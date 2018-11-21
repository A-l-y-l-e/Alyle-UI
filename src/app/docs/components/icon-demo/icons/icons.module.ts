import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyIconModule } from '@alyle/ui/icon';

import { IconsComponent } from './icons.component';
import { LyTypographyModule } from '@alyle/ui/typography';

@NgModule({
  imports: [
    CommonModule,
    LyIconModule,
    LyTypographyModule
  ],
  exports: [IconsComponent],
  declarations: [IconsComponent]
})
export class IconsModule { }
