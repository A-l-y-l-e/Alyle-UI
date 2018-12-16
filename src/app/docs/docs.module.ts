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
import { TabsAlignModule } from './layout/tabs-demo/tabs-align/tabs-align.module';
import { TabsWithIconModule } from './layout/tabs-demo/tabs-with-icon/tabs-with-icon.module';
import { TabsPlacementModule } from './layout/tabs-demo/tabs-placement/tabs-placement.module';

/** Components */
/** Button */
import { ButtonDemoComponent } from '@docs/components/button-demo/button-demo.component';
import { ButtonTypesDemoModule } from '@docs/components/button-demo/button-types-demo/button-types-demo.module';
import { IconLabelButtonsModule } from './components/button-demo/icon-label-buttons/icon-label-buttons.module';

import { LyTypographyModule } from '@alyle/ui/typography';
import { DocsRoutingModule } from '@docs/docs.routing';
import { SharedModule } from '../shared/shared.module';
import { DynamicStylesComponent } from '@docs/customization/dynamic-styles/dynamic-styles.component';
import { DsBasicModule } from '@docs/customization/dynamic-styles/ds-basic/ds-basic.module';

import { ToolbarDemoComponent } from '@docs/components/toolbar-demo/toolbar-demo.component';
import { ToolbarBasicDemoModule } from '@docs/components/toolbar-demo/toolbar-basic-demo/toolbar-basic-demo.module';
import { ToolbarWithIconsModule } from './components/toolbar-demo/toolbar-with-icons/toolbar-with-icons.module';

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

/** Checkbox */
import { CheckboxDemoComponent } from './components/checkbox-demo/checkbox-demo.component';
import { BasicCheckboxModule } from './components/checkbox-demo/basic-checkbox/basic-checkbox.module';
import { ComplexCheckboxModule } from './components/checkbox-demo/complex-checkbox/complex-checkbox.module';

import { PackageStatusModule } from '../package-status/package-status.module';
import { ResponsiveDemoComponent } from './layout/responsive/responsive-demo.component';
import { ResponsiveDemo01Module } from './layout/responsive/responsive-demo-01/responsive-demo-01.module';
import { ResponsiveWithDsModule } from './layout/responsive/responsive-with-ds/responsive-with-ds.module';

import { BasicSnackBarModule } from './components/snack-bar-demo/basic-snack-bar/basic-snack-bar.module';
import { SnackBarDemoComponent } from './components/snack-bar-demo/snack-bar-demo.component';

/** Paper demo */
import { BasicPaperModule } from './customization/paper-demo/basic-paper/basic-paper.module';
import { PaperDemoComponent } from './customization/paper-demo/paper-demo.component';
import { PaperWithColorModule } from './customization/paper-demo/paper-with-color/paper-with-color.module';

/** Icon demo */
import { IconDemoComponent } from './components/icon-demo/icon-demo.component';
import { IconsModule } from './components/icon-demo/icons/icons.module';

/** Tooltip */
import { TooltipDemoComponent } from './components/tooltip-demo/tooltip-demo.component';
import { BasicTooltipModule } from './components/tooltip-demo/basic-tooltip/basic-tooltip.module';

/** Menu */
import { MenuDemoComponent } from './components/menu-demo/menu-demo.component';
import { MenuDemo01Module } from './components/menu-demo/menu-demo-01/menu-demo-01.module';

/** Avatar */
import { AvatarDemoComponent } from './components/avatar-demo/avatar-demo.component';
import { BasicUsesAvatarModule } from './components/avatar-demo/basic-uses-avatar/basic-uses-avatar.module';
import { ListDemoComponent } from './components/list-demo/list-demo.component';

/** List */
import { SimpleListModule } from './components/list-demo/simple-list/simple-list.module';
import { FolderListModule } from './components/list-demo/folder-list/folder-list.module';


@NgModule({
  imports: [
    SharedModule,
    PrismModule,
    DemoViewModule,
    PackageStatusModule,
    LyTypographyModule,
    LyCardModule,
    DocsRoutingModule,
    /** Layout */
    /** Grid */
    GridDemoBasicModule,
    GridDemoAutoLayoutModule,
    GridDemoResponsiveModule,
    /** Responsive */
    ResponsiveDemo01Module,
    ResponsiveWithDsModule,
    /** Tabs demos */
    BasicTabsModule,
    TabsWithLazyLoadingModule,
    TabsWithAsynchronouslyLoadingModule,
    TabsAlignModule,
    TabsWithIconModule,
    TabsPlacementModule,
    /** Dynamic style */
    DsBasicModule,
    /** Button */
    ButtonTypesDemoModule,
    IconLabelButtonsModule,
    /** Toolbar */
    ToolbarBasicDemoModule,
    ToolbarWithIconsModule,
    /** Image cropper */
    ResizingCroppingImagesExample01Module,
    ResizingCroppingImagesExample02Module,
    ResizingCroppingImagesExample03Module,
    /** Badge */
    BasicBadgeModule,
    /** Field */
    BasicFieldModule,
    /** Checkbox */
    BasicCheckboxModule,
    ComplexCheckboxModule,
    /** SnackBar */
    BasicSnackBarModule,
    /** Paper */
    BasicPaperModule,
    PaperWithColorModule,
    /** Icon */
    IconsModule,
    /** Tooltip */
    BasicTooltipModule,
    /** Menu */
    MenuDemo01Module,
    /** Avatar */
    BasicUsesAvatarModule,
    /** List */
    SimpleListModule,
    FolderListModule
  ],
  declarations: [
    ThemingComponent,
    /** Grid */
    GridDemoComponent,
    /** Responsive */
    ResponsiveDemoComponent,
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
    /** Field */
    FieldDemoComponent,
    /** Ckeckbox */
    CheckboxDemoComponent,
    /** SnackBar */
    SnackBarDemoComponent,
    /** Paper */
    PaperDemoComponent,
    /** Icon */
    IconDemoComponent,
    /** Tooltip */
    TooltipDemoComponent,
    /** Menu */
    MenuDemoComponent,
    /** Avatar */
    AvatarDemoComponent,
    /** List */
    ListDemoComponent,
  ]
})
export class DocsModule { }
