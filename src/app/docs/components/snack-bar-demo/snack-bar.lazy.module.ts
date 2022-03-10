import { NgModule, Type } from '@angular/core';

import { BasicSnackBarComponent } from './basic-snack-bar/basic-snack-bar.component';
import { BasicSnackBarModule } from './basic-snack-bar/basic-snack-bar.module';
import { PassingDataToASnackBarModule } from './passing-data-to-a-snack-bar/passing-data-to-a-snack-bar.module';
import { PassingDataToASnackBarComponent } from './passing-data-to-a-snack-bar/passing-data-to-a-snack-bar.component';
import { SnackBarPositionModule } from './snack-bar-position/snack-bar-position.module';
import { SnackBarPositionComponent } from './snack-bar-position/snack-bar-position.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  BasicSnackBarComponent,
  PassingDataToASnackBarComponent,
  SnackBarPositionComponent
];

@NgModule({
  imports: [
    BasicSnackBarModule,
    PassingDataToASnackBarModule,
    SnackBarPositionModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
