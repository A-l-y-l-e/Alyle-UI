import { NgModule, Type } from '@angular/core';
import { MultipleThemesDemo01Module } from './multiple-themes/multiple-themes-demo-01/multiple-themes-demo-01.module';
import { MultipleThemesDemo01Component } from './multiple-themes/multiple-themes-demo-01/multiple-themes-demo-01.component';
import { WithCustomElementComponent } from '../element-registry';



const elements = [
  MultipleThemesDemo01Component
];

@NgModule({
  imports: [
    MultipleThemesDemo01Module
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
