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
import { TableStickyColumnsExampleComponent } from './table-sticky-columns-example/table-sticky-columns-example.component';
import { TableStickyColumnsExampleModule } from './table-sticky-columns-example/table-sticky-columns-example.module';
import { TableUsingNgForExampleComponent } from './table-using-ng-for-example/table-using-ng-for-example.component';
import { TableUsingNgForExampleModule } from './table-using-ng-for-example/table-using-ng-for-example.module';


const elements = [
  TableBasicExampleComponent,
  TableColumnStylingExampleComponent,
  TableFlexBasicExampleComponent,
  TableFooterRowExampleComponent,
  TableStickyColumnsExampleComponent,
  TableUsingNgForExampleComponent,
];

@NgModule({
  imports: [
    TableBasicExampleModule,
    TableColumnStylingExampleModule,
    TableFlexBasicExampleModule,
    TableFooterRowExampleModule,
    TableStickyColumnsExampleModule,
    TableUsingNgForExampleModule,
  ],
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
