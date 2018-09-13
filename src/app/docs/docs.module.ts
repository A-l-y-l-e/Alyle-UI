import { NgModule } from '@angular/core';

import { LyCardModule } from '@alyle/ui/card';

import { DemoViewModule } from '../demo-view';
import { PrismModule } from '../core/prism/prism.module';

/** Getting Started */

/** Customization */
import { ThemingComponent } from '@docs/customization/theming/theming.component';

/** Layout */
/** Grid */
import { GridDemoComponent } from '@docs/layout/grid-demo/grid-demo.component';
import { GridDemoBasicModule } from '@docs/layout/grid-demo/grid-demo-basic/grid-demo-basic.module';
import { GridDemoAutoLayoutModule } from '@docs/layout/grid-demo/grid-demo-auto-layout/grid-demo-auto-layout.module';
import { GridDemoResponsiveModule } from '@docs/layout/grid-demo/grid-demo-responsive/grid-demo-responsive.module';

/** Tabs */
import { TabsDemoComponent } from '@docs/layout/tabs-demo/tabs-demo.component';
import { BasicTabsModule } from '@docs/layout/tabs-demo/basic-tabs/basic-tabs.module';
import { TabsWithAsynchronouslyLoadingModule } from '@docs/layout/tabs-demo/tabs-with-asynchronously-loading/tabs-with-asynchronously-loading.module';
import { TabsWithLazyLoadingModule } from '@docs/layout/tabs-demo/tabs-with-lazy-loading/tabs-with-lazy-loading.module';

/** Components */
import { ButtonDemoComponent } from '@docs/components/button-demo/button-demo.component';
import { ButtonTypesDemoModule } from '@docs/components/button-demo/button-types-demo/button-types-demo.module';

import { LyTypographyModule } from '@alyle/ui/typography';
import { DocsRoutingModule } from '@docs/docs.routing';
import { SharedModule } from '../shared/shared.module';
import { DynamicStylesComponent } from '@docs/customization/dynamic-styles/dynamic-styles.component';
import { DsBasicModule } from '@docs/customization/dynamic-styles/ds-basic/ds-basic.module';

@NgModule({
  imports: [
    SharedModule,
    PrismModule,
    DemoViewModule,
    LyTypographyModule,
    LyCardModule,
    DocsRoutingModule,
    /** Layout */
    /** Grid */
    GridDemoBasicModule,
    GridDemoAutoLayoutModule,
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
