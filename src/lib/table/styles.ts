import { lyl, ThemeVariables, ThemeRef, StyleCollection, LyClasses, StyleTemplate, shadowBuilder } from '@alyle/ui';

export interface LyTableTheme {
  /** Styles for Button Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyTableVariables {
  table?: LyTableTheme;
}

export const STYLES = (theme: ThemeVariables & LyTableVariables, ref: ThemeRef) => {
  const { before, after } = theme;
  const __ = ref.selectorsOf(STYLES);
  console.log('from STYLE', theme.shadow);
  return {
    $name: `LyTable`,
    $global: () => lyl `{
      ${__.root} thead,
      ${__.root} tbody,
      ${__.root} tfoot,
      ${__.headerRow},
      ${__.row},
      ${__.footerRow},
      [ly-header-row],
      [ly-row],
      [ly-footer-row],
      ${__.sticky} {
        background: inherit
      }
      th${__.headerCell}:first-of-type, td${__.cell}:first-of-type, td${__.footerCell}:first-of-type {
        padding-${before}: 24px
      }
      th.${__.headerCell}:last-of-type, td${__.cell}:last-of-type, td${__.footerCell}:last-of-type {
        padding-${after}: 24px
      }
      th${__.headerCell}, td${__.cell}, td${__.footerCell} {
        padding: 0
        border-bottom-width: 1px
        border-bottom-style: solid
      }
      th${__.headerCell} {
        text-align: ${before}
      }
      tr${__.row}, tr${__.footerRow} {
        height: 48px
      }
      ${__.row}, ${__.headerRow}, ${__.footerRow}, th${__.headerCell}, td${__.cell}, td${__.footerCell} {
        border-bottom-color: ${theme.divider}
      }
      ${__.cell}, ${__.footerCell} {
        font-size: 14px
      }
    }`,
    root: () => lyl `{
      font-family: Roboto,Helvetica Neue,sans-serif
      background: ${theme.paper.default}
      box-shadow: ${shadowBuilder(8, theme.shadow)}
      table& {
        border-spacing: 0
      }
      {
        ...${
          (theme.table
            && theme.table.root
            && (theme.table.root instanceof StyleCollection
              ? theme.table.root.setTransformer(fn => fn(__)).css
              : theme.table.root(__))
          )
        }
      }
    }`,
    headerCell: lyl `{
      font-size: 12px
      font-weight: 500
    }`,
    footerCell: lyl `{

    }`,
    cell: lyl `{

    }`,
    row: null,
    headerRow: lyl `{
      tr& {
        height: 56px
      }
    }`,
    footerRow: null,
    sticky: null,
    noDataRow: null,
    fixedLayout: lyl `{
      table-layout: fixed
    }`
  };
};
