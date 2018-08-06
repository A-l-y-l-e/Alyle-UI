import { NgModule } from '@angular/core';
import { ThemingComponent } from '@docs/customization/theming/theming.component';
import { PrismModule } from '../core/prism/prism.module';
import { DemoViewModule } from '../demo-view';
import { LyTypographyModule } from '@alyle/ui/typography';
import { TabsDemoComponent } from '@docs/layout/tabs-demo/tabs-demo.component';
import { BasicTabsModule } from '@docs/layout/tabs-demo/basic-tabs/basic-tabs.module';
import { DocsRoutingModule } from '@docs/docs.routing';
import { SharedModule } from '../shared/shared.module';
import { TabsWithLazyLoadingModule } from '@docs/layout/tabs-demo/tabs-with-lazy-loading/tabs-with-lazy-loading.module';

@NgModule({
  imports: [
    SharedModule,
    PrismModule,
    DemoViewModule,
    LyTypographyModule,
    DocsRoutingModule,
    /** Tabs demos */
    BasicTabsModule,
    TabsWithLazyLoadingModule
  ],
  declarations: [
    ThemingComponent,
    /** Tabs */
    TabsDemoComponent
  ],
  exports: [
    ThemingComponent,
  ]
})
export class DocsModule { }
