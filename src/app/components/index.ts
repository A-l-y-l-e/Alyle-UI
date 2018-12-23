import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { ComponentsComponent } from './components/components.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ],
  declarations: [ComponentsComponent]
})
export class ComponentsModule { }
