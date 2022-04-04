import { NgModule, Type } from '@angular/core';

import { BasicSkeletonModule } from './basic-skeleton/basic-skeleton.module';
import { BasicSkeletonComponent } from './basic-skeleton/basic-skeleton.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';


const elements = [
  BasicSkeletonComponent
];

@NgModule({
  imports: [
    BasicSkeletonModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
