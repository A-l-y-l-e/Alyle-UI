import { Component, ChangeDetectionStrategy } from '@angular/core';
import { lyl, shadowBuilder, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { STYLES as TABLE_STYLES } from '@alyle/ui/table';

interface Transaction {
  product: string;
  price: number;
}

export const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(TABLE_STYLES);
  const table = ref.selectorsOf(TABLE_STYLES);
  return {
    root: lyl `{
      table {
        width: 100%
        box-shadow: ${shadowBuilder(8, theme.shadow)}
      }
      tr${table.footerRow} {
        font-weight: bold
      }
    }`
  };
};

@Component({
  selector: 'aui-table-footer-row-example',
  templateUrl: './table-footer-row-example.component.html',
  providers: [
    StyleRenderer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFooterRowExampleComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  displayedColumns: (keyof Transaction)[] = ['product', 'price'];
  transactions: Transaction[] = [
    {
      product: 'Mangoes',
      price: 5
    }, {
      product: 'Melon',
      price: 4
    }, {
      product: 'Clementine',
      price: 3
    }, {
      product: 'Water - Spring Water 500ml',
      price: 1
    }
  ];

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

  /** Gets the total price of all transactions. */
  getTotalPrice() {
    return this.transactions
      .map(product => product.price)
      .reduce((acc, value) => acc + value, 0);
  }
}
