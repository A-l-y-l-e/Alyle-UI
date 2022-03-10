import { NgModule, Type } from '@angular/core';

import { BasicSelectComponent } from './basic-select/basic-select.component';
import { SelectWithNgModelModule } from './select-with-ng-model/select-with-ng-model.module';
import { SelectMultipleModule } from './select-multiple/select-multiple.module';
import { SelectReactiveFormModule } from './select-reactive-form/select-reactive-form.module';
import { SelectOptionObjectValueModule } from './select-option-object-value/select-option-object-value.module';
import { SelectDisableModule } from './select-disable/select-disable.module';
import { SelectCustomTriggerModule } from './select-custom-trigger/select-custom-trigger.module';
import { BasicSelectModule } from './basic-select/basic-select.module';
import { SelectWithNgModelComponent } from './select-with-ng-model/select-with-ng-model.component';
import { SelectMultipleComponent } from './select-multiple/select-multiple.component';
import { SelectReactiveFormComponent } from './select-reactive-form/select-reactive-form.component';
import { SelectOptionObjectValueComponent } from './select-option-object-value/select-option-object-value.component';
import { SelectDisableComponent } from './select-disable/select-disable.component';
import { SelectCustomTriggerComponent } from './select-custom-trigger/select-custom-trigger.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  BasicSelectComponent,
  SelectWithNgModelComponent,
  SelectMultipleComponent,
  SelectReactiveFormComponent,
  SelectOptionObjectValueComponent,
  SelectDisableComponent,
  SelectCustomTriggerComponent
];

@NgModule({
  imports: [
    BasicSelectModule,
    SelectWithNgModelModule,
    SelectMultipleModule,
    SelectReactiveFormModule,
    SelectOptionObjectValueModule,
    SelectDisableModule,
    SelectCustomTriggerModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
