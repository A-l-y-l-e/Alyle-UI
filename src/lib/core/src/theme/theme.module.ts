import { NgModule } from '@angular/core';

import { LyBgAndColor } from './bg-and-color.directive';
import { LY_GLOBAL_CONTRAST } from './contrast';

@NgModule({
  declarations: [LyBgAndColor],
  exports: [LyBgAndColor],
  providers: [
    { provide: LY_GLOBAL_CONTRAST, useValue: false }
  ]
})
export class ThemeModule { }
