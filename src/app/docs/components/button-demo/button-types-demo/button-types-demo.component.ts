import { Component, ChangeDetectionStrategy } from '@angular/core';
import { lyl, ThemeVariables, StyleRenderer } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => {
  const { after } = theme;
  return {
    root: lyl `{
      button {
        margin-${after}: 1em
        margin-top: .5em
        margin-bottom: .5em
      }
    }`,
    row: lyl `{
      display: flex
      flex-wrap: wrap
      margin-bottom: .5em
      align-items: center
    }`
  };
};

@Component({
  selector: 'aui-button-types-demo',
  templateUrl: './button-types-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class ButtonTypesDemoComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
 }
