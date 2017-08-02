import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { ComponentsComponent } from './components/components.component';
import { RoutesAppService } from './routes-app.service';

@NgModule({
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ],
  declarations: [ComponentsComponent],
  providers: [RoutesAppService]
})
export class ComponentsModule { }
