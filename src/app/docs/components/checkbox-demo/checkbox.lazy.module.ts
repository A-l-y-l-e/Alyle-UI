import { NgModule, Type } from '@angular/core';

import { BasicCheckboxModule } from './basic-checkbox/basic-checkbox.module';
import { ComplexCheckboxModule } from './complex-checkbox/complex-checkbox.module';
import { BasicCheckboxComponent } from './basic-checkbox/basic-checkbox.component';
import { ComplexCheckboxComponent } from './complex-checkbox/complex-checkbox.component';


const elements = [
  BasicCheckboxComponent,
  ComplexCheckboxComponent
];

@NgModule({
  imports: [
    BasicCheckboxModule,
    ComplexCheckboxModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
