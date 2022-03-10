import { NgModule, Type } from '@angular/core';
import { LyTypographyModule } from '@alyle/ui/typography';

import { BasicPaperModule } from './paper-demo/basic-paper/basic-paper.module';
import { BasicPaperComponent } from './paper-demo/basic-paper/basic-paper.component';
import { PaperWithColorModule } from './paper-demo/paper-with-color/paper-with-color.module';
import { PaperWithColorComponent } from './paper-demo/paper-with-color/paper-with-color.component';
import { WithCustomElementComponent } from '../element-registry';

const elements = [
  BasicPaperComponent,
  PaperWithColorComponent
];

@NgModule({
  imports: [
    LyTypographyModule,
    BasicPaperModule,
    PaperWithColorModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
