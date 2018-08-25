import { NgModule } from '@angular/core';
import { LyGrid, LyGridCol } from './grid';

@NgModule({
  exports: [LyGrid, LyGridCol],
  declarations: [LyGrid, LyGridCol]
})
export class LyGridModule { }
