import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';

import { LyDialogContainer } from './dialog-container.directive';

@NgModule({
  entryComponents: [
    LyDialogContainer
  ],
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyCommonModule
  ]
})
export class LyDialogModule { }
