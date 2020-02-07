import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  LyTheme2,
  ThemeVariables } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => ({
  nav: (className: string) => `${className} a{color:${theme.text.default};font-weight:700;position:relative;display:inline-block;margin:15px 25px;outline:none;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-size:1.35em;}${className} a::before{margin-right:10px;content:'{';-webkit-transform:translateX(20px);-moz-transform:translateX(20px);transform:translateX(20px);}${className} a::after{margin-left:10px;content:'}';-webkit-transform:translateX(-20px);-moz-transform:translateX(-20px);transform:translateX(-20px);}${className} a::before,${className} a::after{display:inline-block;opacity:0;-webkit-transition:-webkit-transform 0.3s, opacity 0.2s;-moz-transition:-moz-transform 0.3s, opacity 0.2s;transition:transform 0.3s, opacity 0.2s;}${className} a:hover,${className} a:focus{color:${theme.primary.default};outline:none;}${className} a:hover::after,${className} a:hover::before,${className} a:focus::after,${className} a:focus::before{opacity:1;-webkit-transform:translateX(0px);-moz-transform:translateX(0px);transform:translateX(0px);}`
});

@Component({
  selector: 'aui-ds-nesting',
  templateUrl: './ds-nesting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsNestingComponent {

  readonly classes = this._theme.renderStyleSheet(STYLES);

  constructor(
    private _theme: LyTheme2
  ) { }
}
