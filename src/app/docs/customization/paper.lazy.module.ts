import { NgModule, Type } from '@angular/core';
import { LyTypographyModule } from '@alyle/ui/typography';

import { BasicPaperModule } from './paper-demo/basic-paper/basic-paper.module';
import { BasicPaperComponent } from './paper-demo/basic-paper/basic-paper.component';
import { PaperWithColorModule } from './paper-demo/paper-with-color/paper-with-color.module';
import { PaperWithColorComponent } from './paper-demo/paper-with-color/paper-with-color.component';

const elements = [
  BasicPaperComponent,
  PaperWithColorComponent
];

@NgModule({
  imports: [
    LyTypographyModule,
    BasicPaperModule,
    PaperWithColorModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
