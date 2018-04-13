import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultipleThemesRoutingModule } from './multiple-themes-routing.module';
import { MultipleThemesComponent } from './multiple-themes.component';
import { DemoViewModule } from '../../demo-view/demo-view.module';
import { MultipleThemesDemo01Module } from './multiple-themes-demo-01/multiple-themes-demo-01.module';

@NgModule({
  imports: [
    CommonModule,
    MultipleThemesRoutingModule,
    DemoViewModule,
    MultipleThemesDemo01Module
  ],
  declarations: [MultipleThemesComponent]
})
export class MultipleThemesModule { }
