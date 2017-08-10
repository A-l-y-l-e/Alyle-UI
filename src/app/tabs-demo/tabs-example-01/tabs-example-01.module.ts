import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabsModule } from 'alyle-ui/tabs';
import { TabsExample01Component } from './tabs-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyTabsModule
  ],
  exports: [TabsExample01Component],
  declarations: [TabsExample01Component]
})
export class TabsExample01Module { }
