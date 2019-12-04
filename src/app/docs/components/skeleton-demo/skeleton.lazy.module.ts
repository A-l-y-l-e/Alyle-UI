import { NgModule, Type } from '@angular/core';

import { BasicSkeletonModule } from './basic-skeleton/basic-skeleton.module';
import { BasicSkeletonComponent } from './basic-skeleton/basic-skeleton.component';


const elements = [
  BasicSkeletonComponent
];

@NgModule({
  imports: [
    BasicSkeletonModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
