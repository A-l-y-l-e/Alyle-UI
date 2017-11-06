import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuDemo01Component } from './menu-demo-01.component';
import { LyMenuModule } from 'alyle-ui/menu';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LyButtonModule } from 'alyle-ui/button';

@NgModule({
  imports: [
    CommonModule,
    LyMenuModule,
    LyIconButtonModule,
    LyButtonModule
  ],
  exports: [MenuDemo01Component],
  declarations: [MenuDemo01Component]
})
export class MenuDemo01Module { }
