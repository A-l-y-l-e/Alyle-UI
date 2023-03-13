import { Component } from '@angular/core';
import { StyleRenderer, lyl, ThemeVariables, SelectorsFn } from '@alyle/ui';
import { STYLES as BUTTON_STYLES } from '@alyle/ui/button';

const STYLES = (theme: ThemeVariables, selectors: SelectorsFn) => {
  // Get button component selectors
  const button = selectors(BUTTON_STYLES);
  const { after } = theme;
  return {
    root: lyl `{
      ${button.root} {
        margin-${after}: 1em
      }
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
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
