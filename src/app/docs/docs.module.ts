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
import { DynamicStylesComponent } from './customization/dynamic-styles/dynamic-styles.component';
import { DsBasicModule } from '@docs/customization/dynamic-styles/ds-basic/ds-basic.module';
import { TabsWithAsynchronouslyLoadingModule } from '@docs/layout/tabs-demo/tabs-with-asynchronously-loading/tabs-with-asynchronously-loading.module';
import { GridDemoBasicModule } from '@docs/layout/grid-demo/grid-demo-basic/grid-demo-basic.module';
import { GridDemoResponsiveModule } from '@docs/layout/grid-demo/grid-demo-responsive/grid-demo-responsive.module';
import { GridDemoComponent } from '@docs/layout/grid-demo/grid-demo.component';
import { ButtonDemoComponent } from '@docs/components/button-demo/button-demo.component';
import { ButtonTypesDemoModule } from '@docs/components/button-demo/button-types-demo/button-types-demo.module';

@NgModule({
  imports: [
    SharedModule,
    PrismModule,
    DemoViewModule,
    LyTypographyModule,
    DocsRoutingModule,
    /** Layout */
    /** Grid */
    GridDemoBasicModule,
    GridDemoResponsiveModule,
    /** Tabs demos */
    BasicTabsModule,
    TabsWithLazyLoadingModule,
    TabsWithAsynchronouslyLoadingModule,
    /** Dynamic style */
    DsBasicModule,
    /** Button */
    ButtonTypesDemoModule
  ],
  declarations: [
    ThemingComponent,
    /** Grid */
    GridDemoComponent,
    /** Tabs */
    TabsDemoComponent,
    /** Ds */
    DynamicStylesComponent,
    /** Button */
    ButtonDemoComponent
  ]
})
export class DocsModule { }
