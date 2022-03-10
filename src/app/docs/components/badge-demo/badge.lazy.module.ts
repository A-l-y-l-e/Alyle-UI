import { NgModule, Type } from '@angular/core';

import { BasicBadgeComponent } from './basic-badge/basic-badge.component';
import { CustomBadgeComponent } from './custom-badge/custom-badge.component';
import { DotBadgeComponent } from './dot-badge/dot-badge.component';
import { BasicBadgeModule } from './basic-badge/basic-badge.module';
import { CustomBadgeModule } from './custom-badge/custom-badge.module';
import { DotBadgeModule } from './dot-badge/dot-badge.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';


const elements = [
  BasicBadgeComponent,
  CustomBadgeComponent,
  DotBadgeComponent
];

@NgModule({
  imports: [
    BasicBadgeModule,
    CustomBadgeModule,
    DotBadgeModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
