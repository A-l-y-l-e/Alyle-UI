import { NgModule, Type } from '@angular/core';
import { WithCustomElementComponent } from '@app/docs/element-registry';

import { IconsComponent } from './icons/icons.component';
import { IconsModule } from './icons/icons.module';

const elements = [
  IconsComponent
];

@NgModule({
  imports: [
    IconsModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
