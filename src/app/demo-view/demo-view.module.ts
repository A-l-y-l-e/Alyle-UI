import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCoreModule } from 'alyle-ui/core';
import { LyTabsModule } from 'alyle-ui/tabs';
import { LyToolbarModule } from 'alyle-ui/toolbar';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';
import { LyShadowModule } from 'alyle-ui/shadow';

import { PrismModule } from '../core/prism/prism.module';

import { ViewComponent } from './view/view.component';
import { DemoViewLabelDirective } from './demo-view-label.directive';
import { DemoViewHtmlDirective } from './demo-view-html.directive';
import { DemoViewTsDirective } from './demo-view-ts.directive';
import { DemoViewCssDirective } from './demo-view-css.directive';
import { DemoViewModuleDirective } from './demo-view-module.directive';
import { DemoViewSrcsDirective } from './demo-view-srcs.directive';

@NgModule({
  imports: [
    CommonModule,
    PrismModule,
    LyTabsModule,
    LyShadowModule,
    LyToolbarModule,
    LyIconButtonModule,
    LySvgModule,
    LyCoreModule
  ],
  exports: [ViewComponent, DemoViewLabelDirective, DemoViewHtmlDirective, DemoViewTsDirective, DemoViewCssDirective, DemoViewModuleDirective],
  declarations: [ViewComponent, DemoViewLabelDirective, DemoViewHtmlDirective, DemoViewTsDirective, DemoViewCssDirective, DemoViewModuleDirective, DemoViewSrcsDirective]
})
export class DemoViewModule { }
