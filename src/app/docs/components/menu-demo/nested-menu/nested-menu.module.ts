import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyButtonModule } from '@alyle/ui/button';

import { NestedMenuComponent } from './nested-menu.component';



@NgModule({
  declarations: [NestedMenuComponent],
  imports: [
    CommonModule,
    LyMenuModule,
    LyButtonModule
  ],
  exports: [NestedMenuComponent]
})
export class NestedMenuModule { }
