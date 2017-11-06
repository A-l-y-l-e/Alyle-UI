import { NgModule, ModuleWithProviders, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDrawer, LyDrawerContainer, LyDrawerContent } from './drawer';
import { LyCoreModule } from 'alyle-ui/core';
export * from './drawer';

@NgModule({
  imports: [
    CommonModule,
    LyCoreModule
  ],
  exports: [LyDrawer, LyDrawerContainer, LyDrawerContent],
  declarations: [LyDrawer, LyDrawerContainer, LyDrawerContent],
})
export class LyDrawerModule {}
