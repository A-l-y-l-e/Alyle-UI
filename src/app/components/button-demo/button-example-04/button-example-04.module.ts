import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyCommonModule } from '@alyle/ui';
import { LySvgModule } from '@alyle/ui/svg';
import { LyButtonModule } from '@alyle/ui/button';

import { ButtonExample04Component } from './button-example-04.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule,
    LyButtonModule,
    LyIconButtonModule,
    LySvgModule
  ],
  exports: [ButtonExample04Component],
  declarations: [ButtonExample04Component]
})
export class ButtonExample04Module { }
