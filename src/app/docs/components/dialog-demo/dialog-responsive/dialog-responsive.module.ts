import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTypographyModule } from '@alyle/ui/typography';

import { DialogResponsiveComponent, DialogResponsiveDemo } from './dialog-responsive.component';

@NgModule({
  declarations: [DialogResponsiveComponent, DialogResponsiveDemo],
  entryComponents: [DialogResponsiveDemo],
  imports: [
    CommonModule,
    LyDialogModule,
    LyGridModule,
    LyButtonModule,
    LyTypographyModule
  ],
  exports: [DialogResponsiveComponent]
})
export class DialogResponsiveModule { }
