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

import { ToolbarDemoComponent } from '@docs/components/toolbar-demo/toolbar-demo.component';
import { ToolbarBasicDemoModule } from '@docs/components/toolbar-demo/toolbar-basic-demo/toolbar-basic-demo.module';
// tslint:disable-next-line:max-line-length
import { ResizingCroppingImagesExample01Module } from '@docs/components/resizing-cropping-images-demo/resizing-cropping-images-example-01/resizing-cropping-images-example-01.module';
// tslint:disable-next-line:max-line-length
import { ResizingCroppingImagesExample02Module } from '@docs/components/resizing-cropping-images-demo/resizing-cropping-images-example-02/resizing-cropping-images-example-02.module';
// tslint:disable-next-line:max-line-length
import { ResizingCroppingImagesExample03Module } from '@docs/components/resizing-cropping-images-demo/resizing-cropping-images-example-03/resizing-cropping-images-example-03.module';
import { ResizingCroppingImagesDemoComponent } from '@docs/components/resizing-cropping-images-demo/resizing-cropping-images-demo.component';

import { BadgeDemoComponent } from './components/badge-demo/badge-demo.component';
import { BasicBadgeModule } from '@docs/components/badge-demo/basic-badge/basic-badge.module';

import { FieldDemoComponent } from './components/field-demo/field-demo.component';
import { BasicFieldModule } from '@docs/components/field-demo/basic-field/basic-field.module';

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
    ButtonTypesDemoModule,
    /** Toolbar */
    ToolbarBasicDemoModule,
    /** Image cropper */
    ResizingCroppingImagesExample01Module,
    ResizingCroppingImagesExample02Module,
    ResizingCroppingImagesExample03Module,
    /** Badge */
    BasicBadgeModule,
    /** Field */
    BasicFieldModule
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
    ButtonDemoComponent,
    /** Toolbar */
    ToolbarDemoComponent,
    /** Image cropper */
    ResizingCroppingImagesDemoComponent,
    /** Badge */
    BadgeDemoComponent,
    /** Badge */
    FieldDemoComponent

  ]
})
export class DocsModule { }
