import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';

import { LyDialogContainer } from './dialog-container.component';
import { LyDialog } from './dialog';
import { LyDialogTitle } from './dialog-title.directive';

@NgModule({
  entryComponents: [
    LyDialogContainer
  ],
  declarations: [
    LyDialogContainer,
    LyDialogTitle
  ],
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyCommonModule,
    LyDialogContainer,
    LyDialogTitle
  ],
  providers: [
    LyDialog
  ]
})
export class LyDialogModule { }
