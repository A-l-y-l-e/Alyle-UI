import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyCommonModule } from '@alyle/ui';

import { IconButtonDemoRoutingModule } from './icon-button-demo-routing.module';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';
import { DemoViewModule } from '../../demo-view';
import { IconButtonExample01Module } from './icon-button-example-01/icon-button-example-01.module';
import { PackageStatusModule } from '../../package-status/package-status.module';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    IconButtonDemoRoutingModule,
    DemoViewModule,
    PackageStatusModule,
    IconButtonExample01Module
  ],
  declarations: [IconButtonDemoComponent]
})
export class IconButtonDemoModule { }
