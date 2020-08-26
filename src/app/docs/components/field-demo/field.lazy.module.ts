import { NgModule, Type } from '@angular/core';

import { BasicFieldComponent } from './basic-field/basic-field.component';
import { FieldPlaygroundComponent } from './field-playground/field-playground.component';
import { SimpleFormComponent } from './simple-form/simple-form.component';
import { BasicFieldModule } from './basic-field/basic-field.module';
import { FieldPlaygroundModule } from './field-playground/field-playground.module';
import { SimpleFormModule } from './simple-form/simple-form.module';
import { FieldWithCdkAutosizeModule } from './field-with-cdk-autosize/field-with-cdk-autosize.module';
import { FieldWithCdkAutosizeComponent } from './field-with-cdk-autosize/field-with-cdk-autosize.component';
import { FieldWithPrefixAndSuffixComponent } from './field-with-prefix-and-suffix/field-with-prefix-and-suffix.component';
import { FieldWithPrefixAndSuffixModule } from './field-with-prefix-and-suffix/field-with-prefix-and-suffix.module';
import { FieldWithDisplayWithModule } from './field-with-display-with/field-with-display-with.module';
import { FieldWithDisplayWithComponent } from './field-with-display-with/field-with-display-with.component';

const elements = [
  BasicFieldComponent,
  FieldPlaygroundComponent,
  SimpleFormComponent,
  FieldWithCdkAutosizeComponent,
  FieldWithPrefixAndSuffixComponent,
  FieldWithDisplayWithComponent
];

@NgModule({
  imports: [
    BasicFieldModule,
    FieldPlaygroundModule,
    SimpleFormModule,
    FieldWithCdkAutosizeModule,
    FieldWithPrefixAndSuffixModule,
    FieldWithDisplayWithModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
