import { NgModule, Type } from '@angular/core';

import { BasicRadioComponent } from './basic-radio/basic-radio.component';
import { RadioExample01Component } from './radio-example-01/radio-example-01.component';
import { BasicRadioModule } from './basic-radio/basic-radio.module';
import { RadioExample01Module } from './radio-example-01/radio-example-01.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  BasicRadioComponent,
  RadioExample01Component
];

@NgModule({
  imports: [
    BasicRadioModule,
    RadioExample01Module
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
