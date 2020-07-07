import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

import { ButtonWithLoadingStateComponent } from './button-with-loading-state.component';



@NgModule({
  declarations: [ButtonWithLoadingStateComponent],
  imports: [
    CommonModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [ButtonWithLoadingStateComponent]
})
export class ButtonWithLoadingStateModule { }
