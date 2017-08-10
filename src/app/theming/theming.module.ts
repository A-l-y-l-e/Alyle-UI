import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemingRoutingModule } from './theming-routing.module';
import { ThemingComponent } from './theming/theming.component';

@NgModule({
  imports: [
    CommonModule,
    ThemingRoutingModule
  ],
  declarations: [ThemingComponent]
})
export class ThemingModule { }
