import { Component } from '@angular/core';
import { StyleRenderer, ThemeVariables, lyl } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => {
  const { before, after } = theme;
  return {
    button: lyl `{
      margin: 1em
    }`,
    labelBefore: lyl `{
      padding-${after}: 8px
    }`,
    labelAfter: lyl `{
      padding-${before}: 8px
    }`,
    iconSmall: lyl `{
      font-size: 20px
    }`
  };
};

@Component({
  selector: 'aui-icon-label-buttons',
  templateUrl: './icon-label-buttons.component.html',
  providers: [
    StyleRenderer
  ]
})
export class IconLabelButtonsComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
