import { NgModule, Type } from '@angular/core';

import { ButtonTypesDemoModule } from './button-types-demo/button-types-demo.module';
import { IconLabelButtonsModule } from './icon-label-buttons/icon-label-buttons.module';
import { ButtonTypesDemoComponent } from './button-types-demo/button-types-demo.component';
import { IconLabelButtonsComponent } from './icon-label-buttons/icon-label-buttons.component';
import { ButtonWithLoadingStateModule } from './button-with-loading-state/button-with-loading-state.module';
import { ButtonWithLoadingStateComponent } from './button-with-loading-state/button-with-loading-state.component';


const elements = [
  ButtonTypesDemoComponent,
  IconLabelButtonsComponent,
  ButtonWithLoadingStateComponent
];

@NgModule({
  imports: [
    ButtonTypesDemoModule,
    IconLabelButtonsModule,
    ButtonWithLoadingStateModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
