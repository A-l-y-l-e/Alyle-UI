import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyIconModule } from '@alyle/ui/icon';
import { LyTypographyModule } from '@alyle/ui/typography';

import { IconWithCustomFontComponent } from './icon-with-custom-font.component';

@NgModule({
  imports: [
    CommonModule,
    LyIconModule,
    LyTypographyModule
  ],
  exports: [IconWithCustomFontComponent],
  declarations: [IconWithCustomFontComponent]
})
export class IconWithCustomFontModule { }
