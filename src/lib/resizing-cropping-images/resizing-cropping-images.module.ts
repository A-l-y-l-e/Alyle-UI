import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyResizingCroppingImages } from './resizing-cropping-images';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [LyResizingCroppingImages],
  declarations: [LyResizingCroppingImages]
})
export class LyResizingCroppingImageModule {}
