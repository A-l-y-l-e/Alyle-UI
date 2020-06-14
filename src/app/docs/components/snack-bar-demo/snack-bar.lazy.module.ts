import { NgModule, Type } from '@angular/core';

import { BasicSnackBarComponent } from './basic-snack-bar/basic-snack-bar.component';
import { BasicSnackBarModule } from './basic-snack-bar/basic-snack-bar.module';
import { PassingDataToASnackBarModule } from './passing-data-to-a-snack-bar/passing-data-to-a-snack-bar.module';
import { PassingDataToASnackBarComponent } from './passing-data-to-a-snack-bar/passing-data-to-a-snack-bar.component';

const elements = [
  BasicSnackBarComponent,
  PassingDataToASnackBarComponent
];

@NgModule({
  imports: [
    BasicSnackBarModule,
    PassingDataToASnackBarModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
