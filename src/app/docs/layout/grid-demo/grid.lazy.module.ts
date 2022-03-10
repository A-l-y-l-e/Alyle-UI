import { NgModule, Type } from '@angular/core';

import { GridDemoAutoLayoutModule } from './grid-demo-auto-layout/grid-demo-auto-layout.module';
import { GridDemoAutoLayoutComponent } from './grid-demo-auto-layout/grid-demo-auto-layout.component';
import { GridDemoBasicComponent } from './grid-demo-basic/grid-demo-basic.component';
import { GridDemoBasicModule } from './grid-demo-basic/grid-demo-basic.module';
import { GridDemoResponsiveModule } from './grid-demo-responsive/grid-demo-responsive.module';
import { GridDemoResponsiveComponent } from './grid-demo-responsive/grid-demo-responsive.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  GridDemoAutoLayoutComponent,
  GridDemoBasicComponent,
  GridDemoResponsiveComponent
];

@NgModule({
    imports: [
        GridDemoAutoLayoutModule,
        GridDemoBasicModule,
        GridDemoResponsiveModule
    ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
