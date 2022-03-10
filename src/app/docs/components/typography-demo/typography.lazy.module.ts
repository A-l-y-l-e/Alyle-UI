import { NgModule, Type } from '@angular/core';

import { TruncateTextComponent } from './truncate-text/truncate-text.component';
import { TypographyDemoBasicComponent } from './typography-demo-basic/typography-demo-basic.component';
import { TruncateTextModule } from './truncate-text/truncate-text.module';
import { TypographyDemoBasicModule } from './typography-demo-basic/typography-demo-basic.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  TruncateTextComponent,
  TypographyDemoBasicComponent
];


@NgModule({
  imports: [
    TruncateTextModule,
    TypographyDemoBasicModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
