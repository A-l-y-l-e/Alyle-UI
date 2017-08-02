import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';
import { LyButtonModule } from 'alyle-ui/button';

import { ButtonExample03Component } from './button-example-03.component';

@NgModule({
  imports: [
    CommonModule,
    LyButtonModule,
    LyIconButtonModule,
    LySvgModule
  ],
  exports: [ButtonExample03Component],
  declarations: [ButtonExample03Component]
})
export class ButtonExample03Module { }
