import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';

import { LyDialog } from './dialog';

@NgModule({
  declarations: [
    LyDialog
  ],
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyCommonModule,
    LyDialog
  ]
})
export class LyDialogModule { }
