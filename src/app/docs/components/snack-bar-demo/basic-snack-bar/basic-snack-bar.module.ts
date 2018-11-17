import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicSnackBarComponent } from './basic-snack-bar.component';
import { LyButtonModule } from '@alyle/ui/button';
import { LySnackBarModule } from '@alyle/ui/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    LyButtonModule,
    LySnackBarModule
  ],
  exports: [BasicSnackBarComponent],
  declarations: [BasicSnackBarComponent]
})
export class BasicSnackBarModule { }
