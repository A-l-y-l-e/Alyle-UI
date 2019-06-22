import { Component, ChangeDetectionStrategy, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
import { LyTheme2, ThemeVariables, toBoolean, LY_COMMON_STYLES, getLyThemeStyleUndefinedError } from '@alyle/ui';

const STYLE_PRIORITY = 2;
const STYLES = (theme: ThemeVariables) => ({
  $priority: STYLE_PRIORITY,
  root: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    outline: 0,
    cursor: 'pointer',
    '& {track}, & {bg}, & {thumbContainer}': {
      ...LY_COMMON_STYLES.fill,
      margin: 'auto'
    },
    '&': theme.slider ? theme.slider.root : null
  },
  wrapper: {
    display: 'flex',
    alignItems: 'baseline',
    cursor: 'pointer',
    padding: '16px 0'
  },

  track: { },
  bg: { },
  thumbContainer: {
    position: 'relative',
    width: 0,
    height: 0,
    '&::before': {
      content: `''`,
      position: 'absolute',
      width: '2px',
      height: '24px',
      left: '-1px',
      top: '-24px',
      opacity: .6
    }
  },
  thumb: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    left: '-6px',
    top: '-6px',
    borderRadius: '50% 50% 0%',
    transform: 'rotateZ(-135deg)'
  },
  thumbLabel: {
    position: 'absolute',
    width: '28px',
    height: '28px',
    left: '-14px',
    top: '-50px',
    borderRadius: '50% 50% 0%',
    transform: 'rotateZ(45deg)'
  },
  thumbLabelValue: {
    transform: 'rotateZ(-45deg)',
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff'
  },

  horizontal: {
    width: '48px',
    height: '2px',
    padding: '10px 0',
    '& {track}, & {bg}': {
      height: '2px',
      width: '100%'
    }
  },
  vertical: {
    width: '2px',
    height: '48px',
    padding: '0 10px',
    '& {track}, & {bg}': {
      height: '100%',
      width: '2px'
    }
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
  private _verticalClass?: string | null;

  private _appearance: string;
  private _appearanceClass: string;

  @Input()
  get color() {
    return this._color;
  }
  set color(val: string) {
    this._color = val;
    this._colorClass = this._theme.addStyle(`${LySlider.и}.color:${val}`, (theme: ThemeVariables) => {
      const color = theme.colorOf(val);
      return {
        '& {bg}, & {thumb}, & {thumbLabel}': {
          backgroundColor: color
        },
        '& {thumbContainer}::before': {
          background: `linear-gradient(0deg, ${color} 0%, rgba(0, 0, 0, 0) 50%, ${color} 100%);`
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
    const newVal = toBoolean(val);
    this._vertical = newVal;

    const newClass = newVal
      ? this.classes.vertical
      : this.classes.horizontal;

    this._verticalClass = this._theme.updateClass(
      this._el.nativeElement,
      this._renderer,
      newClass,
      this._verticalClass as any);

  }

  /** The field appearance style. */
  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      if (!(this._theme.variables.slider!.appearance![val])) {
        throw getLyThemeStyleUndefinedError(LySlider.и, 'appearance', val);
      }
      this._appearanceClass = this._theme.addStyle(`${LySlider.и}.appearance:${val}`, (theme: ThemeVariables) => {
        const appearance = theme.slider!.appearance![val];
        return appearance;
      }, this._el.nativeElement, this._appearanceClass, STYLE_PRIORITY, STYLES);
    }
  }
  get appearance() {
    return this._appearance;
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
