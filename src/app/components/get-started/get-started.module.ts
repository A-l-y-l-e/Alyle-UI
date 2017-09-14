import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrismModule } from '../../core/prism/prism.module';
import { GetStartedRoutingModule } from './get-started-routing.module';
import { GetStartedComponent } from './get-started/get-started.component';

@NgModule({
  imports: [
    CommonModule,
    PrismModule,
    GetStartedRoutingModule
  ],
  declarations: [GetStartedComponent]
})
export class GetStartedModule { }
