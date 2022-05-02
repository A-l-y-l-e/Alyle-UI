import { lyl, ThemeVariables, ThemeRef, StyleCollection, LyClasses, StyleTemplate } from '@alyle/ui';

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
      th${__.headerCell}:last-of-type, td${__.cell}:last-of-type, td${__.footerCell}:last-of-type {
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
        color: ${theme.text.primary}
        font-size: 14px
      }

      ly-table {
        display: block
      }

      ly-header-row {
        min-height: 56px
      }

      ly-row, ly-footer-row {
        min-height: 48px
      }

      ly-row, ly-header-row, ly-footer-row {
        display: flex
        // Define a border style, but then widths default to 3px. Reset them to 0px except the bottom
        // which should be 1px;
        border-width: 0
        border-bottom-width: 1px
        border-style: solid
        align-items: center
        box-sizing: border-box
      }

      ly-cell, ly-header-cell, ly-footer-cell {
        &:first-of-type {
          padding-${before}: 24px
        }

        &:last-of-type {
          padding-${after}: 24px
        }
      }

      ly-cell, ly-header-cell, ly-footer-cell {
        flex: 1
        display: flex
        align-items: center
        overflow: hidden
        word-wrap: break-word
        min-height: inherit
      }

    }`,
    root: () => lyl `{
      font-family: Roboto,Helvetica Neue,sans-serif
      background: ${theme.paper.default}
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
    column: null,
    headerCell: lyl `{
      color: ${theme.text.secondary}
      font-size: 12px
      font-weight: 500
    }`,
    footerCell: null,
    cell: null,
    row: null,
    headerRow: lyl `{
      tr& {
        height: 56px
      }
    }`,
    footerRow: null,
    sticky: lyl `{
      position: sticky !important
    }`,
    noDataRow: null,
    fixedLayout: lyl `{
      table-layout: fixed
    }`
  };
};
