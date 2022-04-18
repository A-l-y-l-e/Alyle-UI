import { lyl, ThemeVariables, ThemeRef } from '@alyle/ui';

export const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  const { before, after } = theme;
  const __ = ref.selectorsOf(STYLES);
  return {
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
    }`,
    root: lyl `{
      font-family: Roboto,Helvetica Neue,sans-serif
      table& {
        border-spacing: 0
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
