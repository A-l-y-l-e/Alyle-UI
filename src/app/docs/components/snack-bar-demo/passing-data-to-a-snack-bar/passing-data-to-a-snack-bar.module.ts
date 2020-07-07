import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LySnackBarModule } from '@alyle/ui/snack-bar';

import { PassingDataToASnackBarComponent } from './passing-data-to-a-snack-bar.component';



@NgModule({
  declarations: [PassingDataToASnackBarComponent],
  imports: [
    CommonModule,
    LyButtonModule,
    LySnackBarModule
  ]
})
export class PassingDataToASnackBarModule { }
