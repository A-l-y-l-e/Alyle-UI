import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';

import { LyDialogContainer } from './dialog-container.component';
import { LyDialog } from './dialog';

@NgModule({
  entryComponents: [
    LyDialogContainer
  ],
  declarations: [
    LyDialogContainer
  ],
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyCommonModule,
    LyDialogContainer
  ],
  providers: [
    LyDialog
  ]
})
export class LyDialogModule { }
