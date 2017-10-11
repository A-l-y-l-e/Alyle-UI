import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShadowDemoRoutingModule } from './shadow-demo-routing.module';
import { ShadowDemoComponent } from './shadow-demo/shadow-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ShadowDemoRoutingModule
  ],
  declarations: [ShadowDemoComponent]
})
export class ShadowDemoModule { }
