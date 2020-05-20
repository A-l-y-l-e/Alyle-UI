import { NgModule, Type } from '@angular/core';

import { BasicFieldComponent } from './basic-field/basic-field.component';
import { FieldPlaygroundComponent } from './field-playground/field-playground.component';
import { SimpleFormComponent } from './simple-form/simple-form.component';
import { BasicFieldModule } from './basic-field/basic-field.module';
import { FieldPlaygroundModule } from './field-playground/field-playground.module';
import { SimpleFormModule } from './simple-form/simple-form.module';
import { FieldWithCdkAutosizeModule } from './field-with-cdk-autosize/field-with-cdk-autosize.module';
import { FieldWithCdkAutosizeComponent } from './field-with-cdk-autosize/field-with-cdk-autosize.component';

const elements = [
  BasicFieldComponent,
  FieldPlaygroundComponent,
  SimpleFormComponent,
  FieldWithCdkAutosizeComponent
];

@NgModule({
  imports: [
    BasicFieldModule,
    FieldPlaygroundModule,
    SimpleFormModule,
    FieldWithCdkAutosizeModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
