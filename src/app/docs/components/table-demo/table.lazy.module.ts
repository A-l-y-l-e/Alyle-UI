import { NgModule, Type } from '@angular/core';
import { WithCustomElementComponent } from '@app/docs/element-registry';
import { TableBasicExampleComponent } from './table-basic-example/table-basic-example.component';
import { TableBasicExampleModule } from './table-basic-example/table-basic-example.module';


const elements = [
  TableBasicExampleComponent,
];

@NgModule({
  imports: [
    TableBasicExampleModule,
  ],
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
