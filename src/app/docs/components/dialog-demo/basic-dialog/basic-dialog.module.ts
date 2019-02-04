import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTypographyModule } from '@alyle/ui/typography';

import { BasicDialogComponent, DialogDemo } from './basic-dialog.component';

@NgModule({
  declarations: [BasicDialogComponent, DialogDemo],
  entryComponents: [DialogDemo],
  imports: [
    CommonModule,
    LyDialogModule,
    LyGridModule,
    LyButtonModule,
    LyTypographyModule
  ],
  exports: [BasicDialogComponent]
})
export class BasicDialogModule { }
