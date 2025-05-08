import { Component, ChangeDetectionStrategy, Input, ElementRef, Renderer2 } from '@angular/core';
import { LyTheme2, ThemeRef } from '../theme/theme2.service';
import { ThemeVariables } from '../theme/theme-config';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { lyl } from '../parse';
import { StyleRenderer } from '../minimal/renderer-style';

const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    root: lyl `{
      width: 1em
      height: 1em
      display: inline-block
      position: relative
      font-size: 24px
    }`,
    line: lyl `{
      top: calc(0.5em - 1px)
      position: absolute
      width: ${1 / 3}em
      height: 2px
      background-color: currentColor
      display: inline-block
      transition: all ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}
      &:first-of-type {
        left: 0.25em
        -webkit-transform: rotate(45deg)
        transform: rotate(45deg)
      }
      &:last-of-type {
        right: 0.25em
        -webkit-transform: rotate(-45deg)
        transform: rotate(-45deg)
      }
    }`,
    up: () => lyl `{
      ${__.line}:first-of-type {
        -webkit-transform: rotate(-45deg)
        transform: rotate(-45deg)
      }
      ${__.line}:last-of-type {
        -webkit-transform: rotate(45deg)
        transform: rotate(45deg)
      }
    }`
  };
};

@Component({
  selector: 'ly-expansion-icon',
  templateUrl: './expansion-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ],
  standalone: false
})
export class LyExpansionIcon {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);

  private _color: string;
  private _colorClass: string;

  private _up = false;

  @Input()
  set color(val: string) {
    this._colorClass = this._theme.addStyle('LyExpansionIcon.color', (theme: ThemeVariables) => ({
      '{line}': {
        backgroundColor: theme.colorOf(val)
      }
    }), this._el.nativeElement, this._colorClass, null, STYLES);
  }
  get color() {
    return this._color;
  }
  @Input()
  set up(val: BooleanInput) {
    const newVal = coerceBooleanProperty(val);

    if (newVal !== this.up) {
      this._up = newVal;
      if (newVal) {
        this._renderer.addClass(this._el.nativeElement, this.classes.up);
      } else {
        this._renderer.removeClass(this._el.nativeElement, this.classes.up);
      }
    }
  }
  get up() {
    return this._up;
  }

  constructor(
    readonly sRenderer: StyleRenderer,
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef,
  ) { }

  toggle() {
    this.up = !this.up;
  }
}
