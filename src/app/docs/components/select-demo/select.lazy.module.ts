import { NgModule, Type } from '@angular/core';

import { BasicSelectComponent } from './basic-select/basic-select.component';
import { SelectWithNgModelModule } from './select-with-ng-model/select-with-ng-model.module';
import { SelectMultipleModule } from './select-multiple/select-multiple.module';
import { SelectReactiveFormModule } from './select-reactive-form/select-reactive-form.module';
import { SelectOptionObjectValueModule } from './select-option-object-value/select-option-object-value.module';
import { SelectDisableModule } from './select-disable/select-disable.module';
import { SelectCustomTriggerModule } from './select-custom-trigger/select-custom-trigger.module';
import { BasicSelectModule } from './basic-select/basic-select.module';

const elements = [
  BasicSelectComponent,
  SelectWithNgModelModule,
  SelectMultipleModule,
  SelectReactiveFormModule,
  SelectOptionObjectValueModule,
  SelectDisableModule,
  SelectCustomTriggerModule
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
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
