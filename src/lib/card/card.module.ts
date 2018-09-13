import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCard, LyCardContent, LyCardActions, LyCardMedia } from './card.directive';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyCard, LyCardContent, LyCardActions, LyCardMedia, LyCommonModule],
  declarations: [LyCard, LyCardContent, LyCardActions, LyCardMedia]
})
export class LyCardModule { }
