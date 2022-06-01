import { NgModule, Type } from '@angular/core';

import { BasicCheckboxModule } from './basic-checkbox/basic-checkbox.module';
import { ComplexCheckboxModule } from './complex-checkbox/complex-checkbox.module';
import { BasicCheckboxComponent } from './basic-checkbox/basic-checkbox.component';
import { ComplexCheckboxComponent } from './complex-checkbox/complex-checkbox.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';
import { CheckboxReactiveFormsExampleModule } from './checkbox-reactive-forms-example/checkbox-reactive-forms-example.module';
import { CheckboxReactiveFormsExampleComponent } from './checkbox-reactive-forms-example/checkbox-reactive-forms-example.component';


const elements = [
  BasicCheckboxComponent,
  ComplexCheckboxComponent,
  CheckboxReactiveFormsExampleComponent
];

@NgModule({
  imports: [
    BasicCheckboxModule,
    ComplexCheckboxModule,
    CheckboxReactiveFormsExampleModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
