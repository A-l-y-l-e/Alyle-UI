import { Component, Renderer2, ElementRef } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const styles = (theme: ThemeVariables) => ({
  root: {
    display: 'inline-block'
  },
  container: {},
});

@Component({
  selector: 'ly-field',
  templateUrl: './field.html'
})
export class LyField {
  /**
   * styles
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, 'ly-field', STYLE_PRIORITY);
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _theme: LyTheme2
  ) { }

}
