import { NgModule, Type } from '@angular/core';

import { ButtonTypesDemoModule } from './button-types-demo/button-types-demo.module';
import { IconLabelButtonsModule } from './icon-label-buttons/icon-label-buttons.module';
import { ButtonTypesDemoComponent } from './button-types-demo/button-types-demo.component';
import { IconLabelButtonsComponent } from './icon-label-buttons/icon-label-buttons.component';


const elements = [
  ButtonTypesDemoComponent,
  IconLabelButtonsComponent
];

@NgModule({
  imports: [
    ButtonTypesDemoModule,
    IconLabelButtonsModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
