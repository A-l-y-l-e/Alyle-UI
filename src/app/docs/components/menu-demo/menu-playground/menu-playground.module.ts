import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyButtonModule } from '@alyle/ui/button';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyRadioModule } from '@alyle/ui/radio';

import { MenuPlaygroundComponent } from './menu-playground.component';



@NgModule({
  declarations: [MenuPlaygroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    LyButtonModule,
    LyMenuModule,
    LyCheckboxModule,
    LyRadioModule
  ],
  exports: [MenuPlaygroundComponent]
})
export class MenuPlaygroundModule { }
