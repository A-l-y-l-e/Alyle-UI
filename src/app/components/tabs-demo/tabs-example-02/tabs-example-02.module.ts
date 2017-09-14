import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabsModule } from 'alyle-ui/tabs';
import { TabsExample02Component } from './tabs-example-02.component';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule
  ],
  exports: [TabsExample02Component],
  declarations: [TabsExample02Component]
})
export class TabsExample02Module { }
