import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyTypographyModule } from '@alyle/ui/typography';

import { PaperWithColorComponent } from './paper-with-color.component';

@NgModule({
  imports: [
    LyCommonModule,
    LyTypographyModule
  ],
  exports: [PaperWithColorComponent],
  declarations: [PaperWithColorComponent]
})
export class PaperWithColorModule { }
