import { Component, ChangeDetectionStrategy } from '@angular/core';
import { lyl, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { STYLES as TABLE_STYLES } from '@alyle/ui/table';

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

const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(TABLE_STYLES);
  const table = ref.selectorsOf(TABLE_STYLES);
  const { before, after } = theme;
  return {
    root: () => lyl `{
      table {
        width: 800px
      }

      td${table.column}-star {
        width: 20px
        padding-${after}: 8px
      }

      th, td {
        &${table.column}-position {
          padding-${before}: 8px
        }
      }

      ${table.sticky}-border-elem-${after} {
        border-${before}: 1px solid ${theme.divider}
      }

      ${table.sticky}-border-elem-${before} {
        border-${after}: 1px solid ${theme.divider}
      }
    }`,
    exampleContainer: lyl `{
      height: 400px
      width: 550px
      max-width: 100%
      overflow: auto
    }`
  };
};

@Component({
  selector: 'aui-table-sticky-columns-example',
  templateUrl: './table-sticky-columns-example.component.html',
  providers: [
    StyleRenderer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableStickyColumnsExampleComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  displayedColumns = [
    'name',
    'position',
    'weight',
    'symbol',
    'position',
    'weight',
    'symbol',
    'star',
  ];
  dataSource = ELEMENT_DATA;
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
