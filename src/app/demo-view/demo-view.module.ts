import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyIconModule } from '@alyle/ui/icon';

import { PrismModule } from '../core/prism/prism.module';

import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    PrismModule,
    LyTabsModule,
    LyToolbarModule,
    LyIconButtonModule,
    LyIconModule,
    LyCommonModule
  ],
  exports: [ViewComponent],
  declarations: [ViewComponent]
})
export class DemoViewModule { }
