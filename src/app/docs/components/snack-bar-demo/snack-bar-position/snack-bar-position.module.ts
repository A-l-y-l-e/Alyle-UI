import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LySnackBarModule } from '@alyle/ui/snack-bar';

import { SnackBarPositionComponent } from './snack-bar-position.component';



@NgModule({
  declarations: [
    SnackBarPositionComponent
  ],
  imports: [
    CommonModule,
    LyButtonModule,
    LyFieldModule,
    LySelectModule,
    LySnackBarModule
  ]
})
export class SnackBarPositionModule { }
