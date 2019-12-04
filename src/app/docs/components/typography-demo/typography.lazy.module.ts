import { NgModule, Type } from '@angular/core';

import { TruncateTextComponent } from './truncate-text/truncate-text.component';
import { TypographyDemoBasicComponent } from './typography-demo-basic/typography-demo-basic.component';
import { TruncateTextModule } from './truncate-text/truncate-text.module';
import { TypographyDemoBasicModule } from './typography-demo-basic/typography-demo-basic.module';

const entryComponents = [
  TruncateTextComponent,
  TypographyDemoBasicComponent
];

@NgModule({
  imports: [
    TruncateTextModule,
    TypographyDemoBasicModule
  ],
  entryComponents
})
export class LazyModule {
  static entryComponents: Type<any>[] = entryComponents;
}
