import { Component, Renderer2, ElementRef, ContentChild, AfterContentInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { LyInputNative } from './input';

const STYLE_PRIORITY = -2;
const styles = (theme: ThemeVariables) => ({
  root: {
    display: 'inline-block'
  },
  container: {},
  labelContainer: {},
  labelSpacingStart: {},
  label: {},
  labelSpacingEnd: {},
  underline: {},
  hint: {},
  inputNative: {
    padding: 0,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    fontSize: 'inherit',
    fontFamily: theme.typography.fontFamily
  }
});

type FieldTypes = 'oulined' | 'filled';

@Component({
  selector: 'ly-field',
  templateUrl: './field.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyField implements AfterContentInit {
  /**
   * styles
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, 'ly-field', STYLE_PRIORITY);
  @Input() type: FieldTypes;
  @ContentChild(LyInputNative) _input: LyInputNative;
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _theme: LyTheme2
  ) { }

  ngAfterContentInit() {
    this._renderer.addClass(this._input._hostElement, this.classes.inputNative);
  }

}
