import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyCommonModule } from '@alyle/ui';
import { BgColorDemoRoutingModule } from './bg-color-demo-routing.module';
import { DemoViewModule } from '../../demo-view';
import { BgColorDemoComponent } from './bg-color-demo/bg-color-demo.component';
import { BgColorDemo01Module } from './bg-color-demo-01/bg-color-demo-01.module';
import { PrismModule } from '../../core/prism/prism.module';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    BgColorDemoRoutingModule,
    DemoViewModule,
    PrismModule,
    BgColorDemo01Module
  ],
  declarations: [BgColorDemoComponent]
})
export class BgColorDemoModule { }
