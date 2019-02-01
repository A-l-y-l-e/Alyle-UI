import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicDialogComponent } from './basic-dialog.component';

@NgModule({
  declarations: [BasicDialogComponent],
  imports: [
    CommonModule
  ],
  exports: [BasicDialogComponent]
})
export class BasicDialogModule { }
