import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { ResponsiveModule } from '@alyle/ui/responsive';
import { ResponsiveDemo01Component } from './responsive-demo-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    ResponsiveModule
  ],
  exports: [ResponsiveDemo01Component],
  declarations: [ResponsiveDemo01Component]
})
export class ResponsiveDemo01Module { }
