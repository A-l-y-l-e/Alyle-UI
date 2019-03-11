import { Component, ChangeDetectionStrategy, Input, ElementRef, Renderer2 } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';
import { ThemeVariables } from '../theme/theme-config';
import { toBoolean } from '../minimal/is-boolean';

const STYLES = (theme: ThemeVariables) => ({
  root: {
    width: '1em',
    height: '1em',
    display: 'inline-block',
    position: 'relative',
    fontSize: '24px'
  },
  line: {
    top: 'calc(0.5em - 1px)',
    position: 'absolute',
    width: `${1 / 3}em`,
    height: '2px',
    backgroundColor: 'currentColor',
    display: 'inline-block',
    transition: `all ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}`,
    '&:first-of-type': {
      left: '0.25em',
      '-webkit-transform': 'rotate(45deg)',
      transform: 'rotate(45deg)'
    },
    '&:last-of-type': {
      right: '0.25em',
      '-webkit-transform': 'rotate(-45deg)',
      transform: 'rotate(-45deg)'
    }
  },
  up: {
    '{line}:first-of-type': {
      '-webkit-transform': 'rotate(-45deg)',
      transform: 'rotate(-45deg)'
    },
    '{line}:last-of-type': {
      '-webkit-transform': 'rotate(45deg)',
      transform: 'rotate(45deg)'
    }
  }
});

@Component({
  selector: 'ly-expansion-icon',
  templateUrl: './expansion-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyExpansionIcon {
  readonly classes = this._theme.addStyleSheet(STYLES);

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
  set up(val: boolean | '') {
    const newVal = toBoolean(val);

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
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }

  toggle() {
    this.up = !this.up;
  }
}
