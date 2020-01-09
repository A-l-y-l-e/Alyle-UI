import { Component } from '@angular/core';
import { ThemeVariables, lyl, StyleRenderer } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => {
  const { breakpoints } = theme;
  const mediaStyles = lyl `{
    color: ${theme.primary.contrast}
    background-color: ${theme.primary.default}
  }`;
  return {
    box: lyl `{
      background-color: ${theme.background.primary.default}
      min-width: 110px
      display: inline-flex
      min-height: 110px
      padding: 1em
      font-size: 14px
      text-align: center
      word-break: break-all
      align-items: center
      justify-content: center
    }`,
    demo1: lyl `{
      @media ${breakpoints.XSmall} {
        ...${mediaStyles}
      }
    }`,
    demo2: lyl `{
      @media ${breakpoints.Small} {
        ...${mediaStyles}
      }
    }`,
    demo3: lyl `{
      @media ${breakpoints.Medium} {
        ...${mediaStyles}
      }
    }`,
    demo4: lyl `{
      @media ${breakpoints.Large} {
        ...${mediaStyles}
      }
    }`,
    demo5: lyl `{
      @media ${breakpoints.XLarge} {
        ...${mediaStyles}
      }
    }`,
    demo6: lyl `{
      @media ${breakpoints.Handset} {
        ...${mediaStyles}
      }
    }`,
    demo7: lyl `{
      @media ${breakpoints.Tablet} {
        ...${mediaStyles}
      }
    }`,
    demo8: lyl `{
      @media ${breakpoints.Web} {
        ...${mediaStyles}
      }
    }`
  };
};

@Component({
  selector: 'aui-responsive-with-ds',
  templateUrl: './responsive-with-ds.component.html',
  providers: [
    StyleRenderer
  ]
})
export class ResponsiveWithDsComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
