import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyButtonModule } from '@alyle/ui/button';
import { LyRippleModule } from '@alyle/ui/ripple';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyInputModule } from '@alyle/ui/input';
import { LyIconModule } from '@alyle/ui/icon';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { TabsExample03Component } from './tabs-example-03.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyTabsModule,
    LyButtonModule,
    LyInputModule,
    LyIconButtonModule,
    LyIconModule,
    LyRippleModule
  ],
  exports: [TabsExample03Component],
  declarations: [TabsExample03Component]
})
export class TabsExample03Module { }
