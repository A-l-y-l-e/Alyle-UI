import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { LyResizingCroppingImages } from './resizing-cropping-images';
export * from './resizing-cropping-images';
import { LyCoreModule } from 'alyle-ui/core';

@NgModule({
  imports: [CommonModule, FormsModule, LyCoreModule],
  exports: [LyResizingCroppingImages],
  declarations: [LyResizingCroppingImages]
})
export class LyResizingCroppingImageModule {}
