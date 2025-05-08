import { Component, ChangeDetectionStrategy } from '@angular/core';
import { lyl, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { STYLES as TABLE_STYLES } from '@alyle/ui/table';

export interface Star {
  position: number;
  name: string;
  radius: number;
  temperature: number;
}

const ELEMENT_DATA: Star[] = [
  { position: 1, name: 'UY Scuti', radius: 1708, temperature: 3365 },
  { position: 2, name: 'VY Canis Majoris', radius: 1420, temperature: 3490 },
  { position: 3, name: 'Mu Cephei', radius: 1260, temperature: 3690 },
  { position: 4, name: 'Betelgeuse', radius: 887, temperature: 3500 },
  { position: 5, name: 'Antares A', radius: 680, temperature: 3600 },
  { position: 6, name: 'Pistol Star', radius: 420, temperature: 11800 },
  { position: 7, name: 'Rigel', radius: 78.9, temperature: 11000 },
  { position: 8, name: 'Aldebaran', radius: 45.1, temperature: 3910 },
  { position: 9, name: 'Arcturus', radius: 25.4, temperature: 4286 },
  { position: 10, name: 'Pollux', radius: 9.06, temperature: 4586 },
  { position: 11, name: 'Sun', radius: 1, temperature: 5778 },
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

      td${table.column}-other {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TableStickyColumnsExampleComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  displayedColumns = [
    'name',
    'position',
    'radius',
    'temperature',
    'position',
    'radius',
    'temperature',
    'other',
  ];
  dataSource = ELEMENT_DATA;
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
