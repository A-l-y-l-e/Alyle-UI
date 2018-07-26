import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCard } from './card.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyCard],
  declarations: [LyCard]
})
export class LyCardModule { }
