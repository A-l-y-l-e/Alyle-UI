import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyCommonModule } from '@alyle/ui';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyRadioModule } from '@alyle/ui/radio';
import { MenuDemo02Component } from './menu-demo-02.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule,
    LyMenuModule,
    LyToolbarModule,
    LyButtonModule,
    LyIconButtonModule,
    LyRadioModule
  ],
  exports: [MenuDemo02Component],
  declarations: [MenuDemo02Component]
})
export class MenuDemo02Module { }
