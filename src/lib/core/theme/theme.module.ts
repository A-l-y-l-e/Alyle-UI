import { NgModule } from '@angular/core';

import { BgModule } from './bg';
import { ColorModule } from './color';

@NgModule({
  imports: [
    BgModule,
    ColorModule
  ],
  exports: [BgModule, ColorModule],
  declarations: []
})
export class ThemeModule { }
export * from './bg';
export * from './color';
