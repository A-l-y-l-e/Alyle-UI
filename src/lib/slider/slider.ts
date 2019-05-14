import { Component, ChangeDetectionStrategy, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
import { LyTheme2, ThemeVariables, toBoolean } from '@alyle/ui';

const STYLE_PRIORITY = 2;
const STYLES = (_theme: ThemeVariables) => ({
  $priority: STYLE_PRIORITY,
  root: {
    display: 'inline-block',
    boxSizing: 'border-box',
    padding: '8px',
    outline: 0
  },
  wrapper: {
    display: 'flex',
    alignItems: 'baseline',
    cursor: 'pointer',
    padding: '16px 0'
  },

  track: {
    height: '2px',
    width: '100%'
  },
  trackFill: {
    height: 'inherit'
  },

  horizontal: {
    height: '48px',
    minWidth: '128px'
  },
  vertical: {
    width: '48px',
    minHeight: '128px'
  }
});

@Component({
  selector: 'ly-slider',
  templateUrl: 'slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySlider'
})
export class LySlider implements OnInit {
  static и = 'LySlider';
  readonly classes = this._theme.addStyleSheet(STYLES);
  private _color: string;
  private _colorClass: string;

  private _vertical: boolean;
  private _verticalClass: string;

  @Input()
  get color() {
    return this._color;
  }
  set color(val: string) {
    this._color = val;
    this._colorClass = this._theme.addStyle(val, (theme: ThemeVariables) => {
      const color = theme.colorOf(val);
      return {
        '& {trackFill}': {
          backgroundColor: color
        }
      };
    }, this._el.nativeElement, this._colorClass, STYLE_PRIORITY + 1, STYLES);
  }

  /** Whether the slider is vertical. */
  @Input()
  get vertical() {
    return this._vertical;
  }
  set vertical(val: boolean) {
    this._vertical = val;
    const newClass = toBoolean(val)
    ? this.classes.vertical
    : this.classes.horizontal;

    this._verticalClass = this._theme.updateClass(
      this._el.nativeElement,
      this._renderer,
      newClass,
      this._verticalClass);
  }

  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }

  ngOnInit() {
    /** Set horizontal slider */
    if (this.vertical == null) {
      this.vertical = false;
    }

    /** Set default color */
    if (this.color == null) {
      this.color = 'accent';
    }
  }
}
