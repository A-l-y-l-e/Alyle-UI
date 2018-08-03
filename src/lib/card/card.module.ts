import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCard, LyCardContent, LyCardActions } from './card.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyCard, LyCardContent, LyCardActions],
  declarations: [LyCard, LyCardContent, LyCardActions]
})
export class LyCardModule { }
