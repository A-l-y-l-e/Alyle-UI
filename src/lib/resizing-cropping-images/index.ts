import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResizingCroppingImagesComponent } from './resizing-cropping-images';
export * from './resizing-cropping-images';
import { LyCoreModule } from 'alyle-ui/core';

@NgModule({
  imports: [CommonModule, FormsModule, LyCoreModule],
  exports: [ResizingCroppingImagesComponent],
  declarations: [ResizingCroppingImagesComponent],
})
export class LyResizingCroppingImageModule {
}
