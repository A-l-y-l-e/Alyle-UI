import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexDemoRoutingModule } from './flex-demo-routing.module';
import { FlexDemoComponent } from './flex-demo.component';
import { DemoViewModule } from '../../demo-view';
import { FlexDemoOneModule } from './flex-demo-one/flex-demo-one.module';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    FlexDemoRoutingModule,
    DemoViewModule,
    FlexDemoOneModule
  ],
  declarations: [FlexDemoComponent]
})
export class FlexDemoModule { }
