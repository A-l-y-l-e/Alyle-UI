import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDrawer, LyDrawerContainer, LyDrawerContent } from './drawer';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyDrawer,
    LyDrawerContainer,
    LyDrawerContent,
    LyCommonModule
  ],
  declarations: [LyDrawer, LyDrawerContainer, LyDrawerContent],
})
export class LyDrawerModule {}
