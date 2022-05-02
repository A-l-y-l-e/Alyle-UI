import { NgModule, Type } from '@angular/core';
import { WithCustomElementComponent } from '@app/docs/element-registry';
import { TableBasicExampleComponent } from './table-basic-example/table-basic-example.component';
import { TableBasicExampleModule } from './table-basic-example/table-basic-example.module';
import { TableColumnStylingExampleComponent } from './table-column-styling-example/table-column-styling-example.component';
import { TableColumnStylingExampleModule } from './table-column-styling-example/table-column-styling-example.module';
import { TableFlexBasicExampleComponent } from './table-flex-basic-example/table-flex-basic-example.component';
import { TableFlexBasicExampleModule } from './table-flex-basic-example/table-flex-basic-example.module';
import { TableFooterRowExampleComponent } from './table-footer-row-example/table-footer-row-example.component';
import { TableFooterRowExampleModule } from './table-footer-row-example/table-footer-row-example.module';


const elements = [
  TableBasicExampleComponent,
  TableColumnStylingExampleComponent,
  TableFlexBasicExampleComponent,
  TableFooterRowExampleComponent,
];

@NgModule({
  imports: [
    TableBasicExampleModule,
    TableColumnStylingExampleModule,
    TableFlexBasicExampleModule,
    TableFooterRowExampleModule,
  ],
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
