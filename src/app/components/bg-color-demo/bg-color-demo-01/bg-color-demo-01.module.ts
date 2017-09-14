import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCoreModule } from 'alyle-ui';
import { BgColorDemo01Component } from './bg-color-demo-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyCoreModule
  ],
  exports: [BgColorDemo01Component],
  declarations: [BgColorDemo01Component]
})
export class BgColorDemo01Module { }
