import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTypographyModule } from '@alyle/ui/typography';

import { TruncateTextComponent } from './truncate-text.component';

@NgModule({
  imports: [
    CommonModule,
    LyTypographyModule
  ],
  exports: [TruncateTextComponent],
  declarations: [TruncateTextComponent]
})
export class TruncateTextModule { }
