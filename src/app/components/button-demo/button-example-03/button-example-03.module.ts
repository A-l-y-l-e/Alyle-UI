import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyCommonModule } from '@alyle/ui';
import { LyIconModule } from '@alyle/ui/icon';
import { LyButtonModule } from '@alyle/ui/button';

import { ButtonExample03Component } from './button-example-03.component';
import { LyFlexModule } from '@alyle/ui/flex';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyButtonModule,
    LyIconButtonModule,
    LyIconModule,
    LyFlexModule
  ],
  exports: [ButtonExample03Component],
  declarations: [ButtonExample03Component]
})
export class ButtonExample03Module { }
