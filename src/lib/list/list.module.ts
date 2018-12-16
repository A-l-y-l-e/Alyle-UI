import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';

import { LyList, LyListItem, LyListIcon, LyLine } from './list';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LyList, LyListItem, LyListIcon, LyLine],
  exports: [LyCommonModule, LyList, LyListItem, LyListIcon, LyLine]
})
export class LyListModule {

}
