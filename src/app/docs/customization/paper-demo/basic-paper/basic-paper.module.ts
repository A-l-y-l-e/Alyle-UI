import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyTypographyModule } from '@alyle/ui/typography';

import { BasicPaperComponent } from './basic-paper.component';

@NgModule({
  imports: [
    LyCommonModule,
    LyTypographyModule
  ],
  exports: [BasicPaperComponent],
  declarations: [BasicPaperComponent]
})
export class BasicPaperModule { }
