import { NgModule, Type } from '@angular/core';

import { BasicSnackBarComponent } from './basic-snack-bar/basic-snack-bar.component';
import { BasicSnackBarModule } from './basic-snack-bar/basic-snack-bar.module';

const elements = [
  BasicSnackBarComponent
];

@NgModule({
  imports: [
    BasicSnackBarModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
