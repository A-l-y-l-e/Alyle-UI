import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTypographyModule } from '@alyle/ui/typography';

import { FullScreenDialogComponent, FullScreenDialog } from './full-screen-dialog.component';

@NgModule({
  declarations: [FullScreenDialogComponent, FullScreenDialog],
  entryComponents: [FullScreenDialog],
  imports: [
    CommonModule,
    LyDialogModule,
    LyGridModule,
    LyButtonModule,
    LyTypographyModule
  ],
  exports: [FullScreenDialogComponent]
})
export class FullScreenDialogModule { }
