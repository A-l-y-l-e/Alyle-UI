import { NgModule, Type } from '@angular/core';

import { BasicTabsComponent } from './basic-tabs/basic-tabs.component';
import { TabsWithLazyLoadingComponent } from './tabs-with-lazy-loading/tabs-with-lazy-loading.component';
import { TabsWithAsynchronouslyLoadingComponent } from './tabs-with-asynchronously-loading/tabs-with-asynchronously-loading.component';
import { TabsAlignComponent } from './tabs-align/tabs-align.component';
import { TabsWithIconComponent } from './tabs-with-icon/tabs-with-icon.component';
import { TabsPlacementComponent } from './tabs-placement/tabs-placement.component';
import { BasicTabsModule } from './basic-tabs/basic-tabs.module';
import { TabsWithLazyLoadingModule } from './tabs-with-lazy-loading/tabs-with-lazy-loading.module';
import { TabsWithAsynchronouslyLoadingModule } from './tabs-with-asynchronously-loading/tabs-with-asynchronously-loading.module';
import { TabsAlignModule } from './tabs-align/tabs-align.module';
import { TabsWithIconModule } from './tabs-with-icon/tabs-with-icon.module';
import { TabsPlacementModule } from './tabs-placement/tabs-placement.module';
import { TabsDynamicHeightModule } from './tabs-dynamic-height/tabs-dynamic-height.module';
import { TabsDynamicHeightComponent } from './tabs-dynamic-height/tabs-dynamic-height.component';


const elements = [
  BasicTabsComponent,
  TabsWithLazyLoadingComponent,
  TabsWithAsynchronouslyLoadingComponent,
  TabsAlignComponent,
  TabsWithIconComponent,
  TabsPlacementComponent,
  TabsDynamicHeightComponent
];

@NgModule({
  imports: [
    BasicTabsModule,
    TabsWithLazyLoadingModule,
    TabsWithAsynchronouslyLoadingModule,
    TabsAlignModule,
    TabsWithIconModule,
    TabsPlacementModule,
    TabsDynamicHeightModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
