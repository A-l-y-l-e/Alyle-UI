import { lyl, ThemeVariables } from '@alyle/ui';

export const STYLES = (theme: ThemeVariables) => {
  const { before } = theme;
  return {
    root: lyl `{
      border-spacing: 0
      font-family: Roboto,Helvetica Neue,sans-serif
    }`,
    headerRow: lyl `{
      height: 56px
    }`,
    headerCell: lyl `{
      &:first-of-type {
        padding-${before}: 24px
      }
    }`,
    sticky: null
  };
};
