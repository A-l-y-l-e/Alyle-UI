import { dot, lyl, shadowBuilder, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { Component, ChangeDetectionStrategy } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

const STYLES = (theme: ThemeVariables, _ref: ThemeRef) => {
  const { before, after, shadow } = theme;
  return {
    root: lyl `{
      table {
        width: 100%
        box-shadow: ${shadowBuilder(8, shadow)}
      }
      ${dot('ly-column-demo-position')} {
        width: 32px
        border-right: 1px solid currentColor
        padding-${after}: 24px
        text-align: center
      }

      ${dot('ly-column-demo-name')} {
        padding-${before}: 16px
        font-size: 20px
      }

      ${dot('ly-column-demo-weight')} {
        font-style: italic
      }

      ${dot('ly-column-demo-symbol')} {
        width: 32px
        text-align: center
        font-weight: bold
      }
    }`
  };
};

@Component({
  selector: 'aui-table-column-styling-example',
  templateUrl: './table-column-styling-example.component.html',
  providers: [
    StyleRenderer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableColumnStylingExampleComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];
  dataSource = ELEMENT_DATA;
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
