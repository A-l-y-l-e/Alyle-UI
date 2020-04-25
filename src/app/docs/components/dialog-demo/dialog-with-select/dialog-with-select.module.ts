import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyButtonModule } from '@alyle/ui/button';

import { DialogWithSelectComponent } from './dialog-with-select.component';
import { DialogWithSelectDialog } from './dialog-with-select-dialog';



@NgModule({
  declarations: [DialogWithSelectComponent, DialogWithSelectDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LyDialogModule,
    LyFieldModule,
    LySelectModule,
    LyButtonModule
  ],
  entryComponents: [DialogWithSelectDialog],
  exports: [DialogWithSelectComponent]
})
export class DialogWithSelectModule { }
