import { NgModule } from '@angular/core';

import { LyFlex } from './flex.directive';
import { LyFlexItem } from './flex-item.directive';
import { LyGrid, LyGridCol } from './grid.directive';

@NgModule({
  exports: [LyFlex, LyFlexItem, LyGrid, LyGridCol],
  declarations: [LyFlex, LyFlexItem, LyGrid, LyGridCol]
})
export class LayoutModule { }
