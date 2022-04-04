import { NgModule, Type } from '@angular/core';

import { MenuDemo01Component } from './menu-demo-01/menu-demo-01.component';
import { MenuDemo01Module } from './menu-demo-01/menu-demo-01.module';
import { MenuPlaygroundComponent } from './menu-playground/menu-playground.component';
import { MenuPlaygroundModule } from './menu-playground/menu-playground.module';
import { NestedMenuModule } from './nested-menu/nested-menu.module';
import { NestedMenuComponent } from './nested-menu/nested-menu.component';
import { OpenOnHoverMenuModule } from './open-on-hover-menu/open-on-hover-menu.module';
import { OpenOnHoverMenuComponent } from './open-on-hover-menu/open-on-hover-menu.component';
import { MenuWithIconsModule } from './menu-with-icons/menu-with-icons.module';
import { MenuWithIconsComponent } from './menu-with-icons/menu-with-icons.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const entryComponents = [
  MenuDemo01Component,
  MenuPlaygroundComponent,
  NestedMenuComponent,
  OpenOnHoverMenuComponent,
  MenuWithIconsComponent
];

@NgModule({
  imports: [
    MenuDemo01Module,
    MenuPlaygroundModule,
    NestedMenuModule,
    OpenOnHoverMenuModule,
    MenuWithIconsModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = entryComponents;
}
