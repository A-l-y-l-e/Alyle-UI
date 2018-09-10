import { NgModule } from '@angular/core';
import { LyGrid, LyGridItem } from './grid';

@NgModule({
  exports: [LyGrid, LyGridItem],
  declarations: [LyGrid, LyGridItem]
})
export class LyGridModule { }
