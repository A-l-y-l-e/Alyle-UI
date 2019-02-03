import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyButtonModule } from '@alyle/ui/button';

import { BasicDialogComponent, DialogDemo } from './basic-dialog.component';

@NgModule({
  declarations: [BasicDialogComponent, DialogDemo],
  entryComponents: [DialogDemo],
  imports: [
    CommonModule,
    LyDialogModule,
    LyButtonModule
  ],
  exports: [BasicDialogComponent]
})
export class BasicDialogModule { }
