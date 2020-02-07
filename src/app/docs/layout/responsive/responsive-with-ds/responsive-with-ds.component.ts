import { Component } from '@angular/core';
import {
  ThemeVariables,
  st2c,
  StyleRenderer } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => {
  const { breakpoints } = theme;
  const mediaStyles = (className: string) => `${className}{color:${theme.primary.contrast};background-color:${theme.primary.default};}`;
  return {
    box: (className: string) => `${className}{background-color:${theme.background.primary.default};min-width:110px;display:inline-flex;min-height:110px;padding:1em;font-size:14px;text-align:center;word-break:break-all;align-items:center;justify-content:center;}`,
    demo1: (className: string) => `@media ${breakpoints.XSmall}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`,
    demo2: (className: string) => `@media ${breakpoints.Small}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`,
    demo3: (className: string) => `@media ${breakpoints.Medium}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`,
    demo4: (className: string) => `@media ${breakpoints.Large}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`,
    demo5: (className: string) => `@media ${breakpoints.XLarge}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`,
    demo6: (className: string) => `@media ${breakpoints.Handset}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`,
    demo7: (className: string) => `@media ${breakpoints.Tablet}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`,
    demo8: (className: string) => `@media ${breakpoints.Web}{/* __READY__ */${st2c((mediaStyles), `${className}`)}}`
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
