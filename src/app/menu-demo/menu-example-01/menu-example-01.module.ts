import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyMenuModule } from 'alyle-ui/menu';
import { LyButtonModule } from 'alyle-ui/button';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';
import { MenuExample01Component } from './menu-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyMenuModule,
    LyButtonModule,
    LyIconButtonModule,
    LySvgModule
  ],
  exports: [MenuExample01Component],
  declarations: [MenuExample01Component]
})
export class MenuExample01Module { }
