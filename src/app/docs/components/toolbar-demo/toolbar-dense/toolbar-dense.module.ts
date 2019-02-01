import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';

import { ToolbarDenseComponent } from './toolbar-dense.component';

@NgModule({
  declarations: [ToolbarDenseComponent],
  imports: [
    CommonModule,
    LyToolbarModule,
    LyTypographyModule,
  ],
  exports: [ToolbarDenseComponent]
})
export class ToolbarDenseModule { }
