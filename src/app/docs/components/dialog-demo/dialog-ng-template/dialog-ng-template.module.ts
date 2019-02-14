import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyButtonModule } from '@alyle/ui/button';

import { DialogNgTemplateComponent } from './dialog-ng-template.component';

@NgModule({
  declarations: [DialogNgTemplateComponent],
  imports: [
    CommonModule,
    LyDialogModule,
    LyButtonModule
  ],
  exports: [DialogNgTemplateComponent]
})
export class DialogNgTemplateModule { }
