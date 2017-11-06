import { LyCoreModule } from 'alyle-ui/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerDemo01Component } from './drawer-demo-01.component';
import { LyDrawerModule } from 'alyle-ui/drawer';
import { LyButtonModule } from 'alyle-ui/button';

@NgModule({
  imports: [
    CommonModule,
    LyCoreModule,
    LyDrawerModule,
    LyButtonModule
  ],
  exports: [DrawerDemo01Component],
  declarations: [DrawerDemo01Component]
})
export class DrawerDemo01Module { }
