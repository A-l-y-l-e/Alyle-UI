import { Component, ChangeDetectionStrategy, ElementRef, Renderer2, Input, OnInit, forwardRef } from '@angular/core';
import { LyTheme2, ThemeVariables, toBoolean, LY_COMMON_STYLES, getLyThemeStyleUndefinedError } from '@alyle/ui';
import { SliderVariables } from './slider.config';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

interface ThemeVariablesWithSlider extends ThemeVariables {
  slider: SliderVariables;
}

export const LY_SLIDER_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LySlider),
  multi: true
};

const STYLE_PRIORITY = 2;
const STYLES = (theme: ThemeVariablesWithSlider) => ({
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
      opacity: .6
    }
  },
  thumb: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    left: '-6px',
    top: '-6px',
    borderRadius: '50% 50% 0%'
  },
  thumbLabel: {
    position: 'absolute',
    width: '28px',
    height: '28px',
    borderRadius: '50% 50% 0%'
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
    width: '96px',
    height: '2px',
    padding: '10px 0',
    '& {track}, & {bg}': {
      height: '2px',
      width: '100%'
    },
    '& {thumb}': {
      transform: 'rotateZ(-135deg)'
    },
    '& {thumbLabel}': {
      left: '-14px',
      top: '-50px',
      transform: 'rotateZ(45deg)'
    },
    '{thumbContainer}::before': {
      width: '2px',
      height: '24px',
      left: '-1px',
      top: '-24px',
    }
  },
  vertical: {
    width: '2px',
    height: '96px',
    padding: '0 10px',
    '& {track}, & {bg}': {
      height: '100%',
      width: '2px'
    },
    '& {thumb}': {
      transform: 'rotateZ(135deg)'
    },
    '& {thumbLabel}': {
      left: '-50px',
      top: '-14px',
      transform: 'rotateZ(-45deg)'
    },
    '{thumbContainer}::before': {
      width: '24px',
      height: '2px',
      left: '-24px',
      top: '-1px'
    }
  }
});

@Component({
  selector: 'ly-slider',
  templateUrl: 'slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySlider',
  providers: [LY_SLIDER_CONTROL_VALUE_ACCESSOR]
})
export class LySlider implements OnInit, ControlValueAccessor {
  static и = 'LySlider';
  readonly classes = this._theme.addStyleSheet(STYLES);
  private _color: string;
  private _colorClass: string;

  private _vertical: boolean;
  private _verticalClass?: string | null;

  private _appearance: string;
  private _appearanceClass: string;

  /** The field appearance style. */
  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      this._appearanceClass = this._theme.addStyle(`${LySlider.и}.appearance:${val}`, (theme: ThemeVariablesWithSlider) => {
        const styleFn = theme.slider.appearance![val].appearance;
        if (!styleFn) {
          throw getLyThemeStyleUndefinedError(LySlider.и, 'appearance', val);
        }
        return styleFn(theme, val);
      }, this._el.nativeElement, this._appearanceClass, STYLE_PRIORITY, STYLES);
    }
  }
  get appearance() {
    return this._appearance;
  }

  /** Color of component */
  @Input()
  get color() {
    return this._color;
  }
  set color(val: string) {
    this._color = val;
    const appearance = this.appearance;
    const styleKey = `${LySlider.и}.color:${val}`;
    if (!this._theme.existStyle(styleKey)) {

    }
    const newStyle = (theme: ThemeVariablesWithSlider) => {
      const color = theme.colorOf(val);
      return theme.slider.appearance![appearance].color(theme, color);
    };
    this._colorClass = this._theme.addStyle(
      styleKey,
      newStyle,
      this._el.nativeElement,
      this._colorClass,
      STYLE_PRIORITY + 1, STYLES);
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

  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }

  ngOnInit() {

    /** Set default appearance */
    if (this.appearance == null) {
      this.appearance = (
        this._theme.variables as ThemeVariablesWithSlider).slider.defaultConfig!.appearance!;
    }

    /** Set horizontal slider */
    if (this.vertical == null) {
      this.vertical = false;
    }

    /** Set default color */
    if (this.color == null) {
      this.color = 'accent';
    }
  }

  writeValue(obj: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnChange(fn: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    throw new Error("Method not implemented.");
  }
}

