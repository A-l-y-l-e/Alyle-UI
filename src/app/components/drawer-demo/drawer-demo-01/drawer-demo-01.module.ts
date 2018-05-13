import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerDemo01Component } from './drawer-demo-01.component';
import { LyCommonModule } from '@alyle/ui';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyButtonModule } from '@alyle/ui/button';
import { LyRadioModule } from '@alyle/ui/radio';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule,
    LyDrawerModule,
    LyButtonModule,
    LyRadioModule
  ],
  exports: [DrawerDemo01Component],
  declarations: [DrawerDemo01Component]
})
export class DrawerDemo01Module { }
