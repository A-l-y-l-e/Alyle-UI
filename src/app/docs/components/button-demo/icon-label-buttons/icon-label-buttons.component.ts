import { Component } from '@angular/core';
import { StyleRenderer, lyl, ThemeVariables, ThemeRef } from '@alyle/ui';
import { STYLES as STYLES_BUTTON } from '@alyle/ui/button';

const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  // Make sure button styles have been rendered
  ref.renderStyleSheet(STYLES_BUTTON);
  // Get selectors
  const button = ref.selectorsOf(STYLES_BUTTON);
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
