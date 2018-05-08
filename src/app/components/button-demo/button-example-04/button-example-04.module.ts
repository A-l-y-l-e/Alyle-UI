import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyCommonModule } from '@alyle/ui';
import { LyIconModule } from '@alyle/ui/icon';
import { LyButtonModule } from '@alyle/ui/button';

import { ButtonExample04Component } from './button-example-04.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule,
    LyButtonModule,
    LyIconButtonModule,
    LyIconModule
  ],
  exports: [ButtonExample04Component],
  declarations: [ButtonExample04Component]
})
export class ButtonExample04Module { }
