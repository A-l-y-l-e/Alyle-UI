import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTabsModule } from 'alyle-ui/tabs';
import { LyToolbarModule } from 'alyle-ui/toolbar';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';
import {
  AlyleUIModule,
  LyShadowModule,
} from 'alyle-ui';

import { PrismModule } from '../core/prism/prism.module';

import { ViewComponent } from './view/view.component';
import { DemoViewLabelDirective } from './demo-view-label.directive';
import { DemoViewHtmlDirective } from './demo-view-html.directive';
import { DemoViewTsDirective } from './demo-view-ts.directive';
import { DemoViewCssDirective } from './demo-view-css.directive';
import { DemoViewModuleDirective } from './demo-view-module.directive';

@NgModule({
  imports: [
    CommonModule,
    PrismModule,
    LyTabsModule,
    LyShadowModule,
    LyToolbarModule,
    LyIconButtonModule,
    LySvgModule
  ],
  exports: [ViewComponent, DemoViewLabelDirective, DemoViewHtmlDirective, DemoViewTsDirective, DemoViewCssDirective, DemoViewModuleDirective],
  declarations: [ViewComponent, DemoViewLabelDirective, DemoViewHtmlDirective, DemoViewTsDirective, DemoViewCssDirective, DemoViewModuleDirective]
})
export class DemoViewModule { }
