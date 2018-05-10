import { NgModule, ModuleWithProviders, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyCommonModule } from '@alyle/ui';
import { LyResizingCroppingImages } from './resizing-cropping-images';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [LyResizingCroppingImages],
  declarations: [LyResizingCroppingImages]
})
export class LyResizingCroppingImageModule {}
