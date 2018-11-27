import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LyCommonModule } from '@alyle/ui';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyCardModule } from '@alyle/ui/card';
import { LyTooltipModule } from '@alyle/ui/tooltip';

import { PrismModule } from '../core/prism/prism.module';

import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    PrismModule,
    LyTabsModule,
    LyToolbarModule,
    LyButtonModule,
    LyIconModule,
    LyCommonModule,
    LyCardModule,
    LyTooltipModule,
    RouterModule
  ],
  exports: [ViewComponent],
  declarations: [ViewComponent]
})
export class DemoViewModule { }
