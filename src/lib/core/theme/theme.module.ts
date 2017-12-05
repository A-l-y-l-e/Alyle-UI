import { NgModule } from '@angular/core';

import { BgModule } from './bg/bg.module';
import { ColorModule } from './color/color.module';

@NgModule({
  imports: [
    BgModule,
    ColorModule
  ],
  exports: [BgModule, ColorModule],
  declarations: []
})
export class ThemeModule { }
export * from './bg/bg.module';
export * from './color/color.module';
