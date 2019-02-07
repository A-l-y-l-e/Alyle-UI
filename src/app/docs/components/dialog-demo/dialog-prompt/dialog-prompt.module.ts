import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyFieldModule } from '@alyle/ui/field';

import { DialogPromptComponent, DialogPromptDialog } from './dialog-prompt.component';

@NgModule({
  declarations: [DialogPromptComponent, DialogPromptDialog],
  entryComponents: [DialogPromptDialog],
  imports: [
    CommonModule,
    FormsModule,
    LyDialogModule,
    LyGridModule,
    LyButtonModule,
    LyTypographyModule,
    LyFieldModule
  ],
  exports: [DialogPromptComponent]
})
export class DialogPromptModule { }
