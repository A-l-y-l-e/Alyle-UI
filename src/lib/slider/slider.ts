import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Renderer2,
  Input,
  OnInit,
  forwardRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  OnDestroy,
  QueryList,
  ViewChildren,
  InjectionToken,
  Inject,
  Optional,
  NgZone} from '@angular/core';
import { LyTheme2,
  ThemeVariables,
  toBoolean,
  LY_COMMON_STYLES,
  toNumber,
  untilComponentDestroyed,
  Dir,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  lyl,
  ThemeRef,
  StyleRenderer} from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { DOWN_ARROW, END, hasModifierKey, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { LY_SLIDER } from './tokens';
import { гvalueToPercent } from './util';

const activeEventOptions = normalizePassiveListenerOptions({passive: false});

export interface LySliderTheme {
  /** Styles for Slider Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  /**
   * Disabled state
   * @param classes Classes
   * @param color color slider (deprecated)
   */
  disabled?: StyleCollection<((classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate);
  color?: StyleCollection<((classes: LyClasses<typeof STYLES>, color: Color, contrast: Color) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>, color: Color, contrast: Color) => StyleTemplate);
  appearance?: {
    standard?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
    [key: string]: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate) | undefined;
  };
}

export interface LySliderDefaultOptions {
  appearance?: string;
}

export const LY_SLIDER_DEFAULT_OPTIONS =
    new InjectionToken<LySliderDefaultOptions>('LY_SLIDER_DEFAULT_OPTIONS');

export interface LySliderVariables {
  slider?: LySliderTheme;
}

export const LY_SLIDER_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LySlider),
  multi: true
};

const STYLE_PRIORITY = -2;
export const STYLES = (theme: ThemeVariables & LySliderVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  const { before } = theme;
  const isRTL = theme.isRTL();
  return {
    $priority: STYLE_PRIORITY,
    root: () => lyl `{
      display: inline-block
      position: relative
      box-sizing: border-box
      ${__.bg} {
        ...${LY_COMMON_STYLES.fill}
        margin: auto
      }
      // always show visible thumb, when {thumbVisible} is available
      &${__.thumbVisible} ${__.thumb},
      // on hover
      &:not(${__.thumbNotVisible}):not(${__.disabled}) ${__.thumbContent}:hover ${__.thumb},
      // on focused
      &:not(${__.thumbNotVisible}) ${__.thumbContent}${__.thumbContentFocused} ${__.thumb} {
        border-radius: 50% 50% 0%
      }

      &${__.thumbVisible} ${__.thumbContent}::before,
      &:not(${__.thumbNotVisible}):not(${__.disabled}) ${__.thumbContent}:hover::before,
      &:not(${__.thumbNotVisible}) ${__.thumbContent}${__.thumbContentFocused}::before {
        transform: scale(1)
      }
      &${__.sliding} {
        ${__.thumb}, ${__.thumbLabel} {
          cursor: -webkit-grabbing
          cursor: grabbing
        }
      }
      {
        ...${
          (theme.slider
            && theme.slider.root
            && (theme.slider.root instanceof StyleCollection
              ? theme.slider.root.setTransformer(fn => fn(__)).css
              : theme.slider.root(__))
          )
        }
      }
    }`,

    track: () => lyl `{
      position: absolute
      margin: auto
      ${__.horizontal} & {
        transform-origin: ${ isRTL ? 100 : 0}% 0
      }
      ${__.vertical} & {
        transform-origin: ${ isRTL ? 100 : 0}% 100%
      }
    }`,
    bg: null,
    thumbContainer: lyl `{
      width: 0
      height: 0
      position: absolute
      margin: auto
    }`,
    thumbContent: lyl `{
      &::before {
        content: ''
        position: absolute
        opacity: .6
        transform: scale(0)
        transition: transform ${
          theme.animations.durations.entering
        }ms ${theme.animations.curves.sharp} 0ms, background ${
          theme.animations.durations.complex
        }ms ${theme.animations.curves.sharp} 0ms
      }
    }`,
    thumb: lyl `{
      position: absolute
      width: 12px
      height: 12px
      left: -6px
      top: -6px
      border-radius: 50%
      outline: 0
      cursor: -webkit-grab
      cursor: grab
      transition: ${['border-radius'].map(prop => `${prop} ${
        theme.animations.durations.exiting
      }ms ${theme.animations.curves.standard} 0ms`).join()}
      &::before {
        content: ''
        ...${LY_COMMON_STYLES.fill}
        border-radius: 50%
        transition: ${['box-shadow'].map(prop => `${prop} ${
          theme.animations.durations.entering
        }ms ${theme.animations.curves.sharp} 0ms`).join()}
      }
    }`,
    thumbLabel: lyl `{
      position: absolute
      width: 28px
      height: 28px
      border-radius: 50%
      top: -14px
      ${before}: -14px
      cursor: -webkit-grab
      cursor: grab
      transition: ${['transform', 'top', 'left', 'right', 'border-radius'].map(prop => `${prop} ${
        theme.animations.durations.entering
      }ms ${theme.animations.curves.sharp} 0ms`).join()}
    }`,
    thumbLabelValue: lyl `{
      display: flex
      height: 100%
      width: 100%
      align-items: center
      justify-content: center
      font-size: 12px
      color: #fff
    }`,

    horizontal: () => lyl `{
      width: 120px
      height: 2px
      padding: 10px 0
      touch-action: pan-y !important
      ${__.track}, ${__.bg} {
        height: 2px
        width: 100%
      }
      ${__.track} {
        ${before}: 0
        top: 0
        bottom: 0
      }
      & ${__.thumb} {
        transform: rotateZ(-135deg)
      }

      ${__.thumbLabel} {
        transform: rotateZ(45deg) scale(0)
      }
      // always show visible thumb, when {thumbVisible} is available
      &${__.thumbVisible} ${__.thumbLabel},
      // on hover
      &:not(${__.disabled}) ${__.thumbContent}:hover ${__.thumbLabel},
      // on focused
      & ${__.thumbContent}${__.thumbContentFocused} ${__.thumbLabel} {
        border-radius: 50% 50% 0%
        top: -50px
        transform: rotateZ(45deg) scale(1)
      }

      & ${__.thumbLabelValue} {
        transform: rotateZ(-45deg)
      }
      ${__.thumbContainer} {
        top: 0
        bottom: 0
      }
      & ${__.thumbContent}::before {
        width: 2px
        height: 24px
        left: -1px
        top: -24px
      }

      ${__.tick} {
        width: 2px
        height: inherit
        top: 0
        bottom: 0
        transform: translate(-1px, 0%)
      }
      ${__.mark} {
        top: 22px
        transform: translateX(${theme.direction === Dir.ltr ? '-' : ''}50%)
      }
      &${__.marked} {
        margin-bottom: 24px
      }
    }`,
    vertical: () => lyl `{
      width: 2px
      height: 120px
      padding: 0 10px
      touch-action: pan-x !important
      & ${__.track}, & ${__.bg} {
        height: 100%
        width: 2px
      }
      ${__.track} {
        bottom: 0
        left: 0
        right: 0
      }
      & ${__.thumb} {
        transform: ${theme.direction === Dir.ltr ? 'rotateZ(135deg)' : 'rotateZ(-45deg)'}
      }
      & ${__.thumbLabel} {
        transform: rotateZ(-45deg) scale(0)
      }
      // always show visible thumb, when {thumbVisible} is available
      &${__.thumbVisible} ${__.thumbLabel},
      // on hover
      &:not(${__.disabled}) ${__.thumbContent}:hover ${__.thumbLabel},
      // on focused
      & ${__.thumbContent}${__.thumbContentFocused} ${__.thumbLabel} {
        border-radius: ${theme.direction === Dir.ltr ? '50% 50% 0%' : '0 50% 50% 50%'}
        ${before}: -50px
        transform: rotateZ(-45deg) scale(1)
      }

      & ${__.thumbLabelValue} {
        transform: rotateZ(45deg)
      }
      ${__.thumbContainer} {
        left: 0
        right: 0
      }
      ${__.thumbContent}::before {
        width: 24px
        height: 2px
        ${before}: -24px
        top: -1px
      }
      ${__.tick} {
        width: inherit
        height: 2px
        left: 0
        right: 0
      }
      ${__.mark} {
        ${before}: 22px
        transform: translateY(50%)
      }
      &${__.marked} {
        ${theme.direction === Dir.ltr ? 'margin-right' : 'margin-left'}: 24px
      }
    }`,

    marked: null,
    mark: lyl `{
      position: absolute
      white-space: nowrap
      font-size: 14px
      color: ${theme.text.secondary}
    }`,
    markActive: lyl `{
      color: currentColor
    }`,
    tick: lyl `{
      position: absolute
      margin: auto
    }`,
    tickActive: null,

    thumbVisible: null,
    thumbNotVisible: null,
    thumbContentFocused: null,
    sliding: null,
    disabled: lyl `{
      cursor: default
    }`
  };
};
/** A change event emitted by the LySlider component. */
export class LySliderChange {

  constructor(
      /** The LySlider that changed. */
    public source: LySlider,
    /** The new value of the source slider. */
    public value: number | (number | null)[] | null,
  ) { }
}

interface Thumb {
  value: number;
  displayValue: string | number | null;
  percent: number | null;
  styles: { [key: string]: string };
  focused?: boolean;
  sliding?: boolean;
  index: number;
}

export interface LySliderMark {
  value: number;
  label: number | string;
}

@Component({
  selector: 'ly-slider',
  templateUrl: 'slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySlider',
  providers: [
    LY_SLIDER_CONTROL_VALUE_ACCESSOR,
    StyleRenderer,
    { provide: LY_SLIDER, useExisting: LySlider },
  ],
  host: {
    '(focus)': '_onFocus()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
    '(keyup)': '_onKeyup()',
    '(mouseenter)': '_onMouseenter()',

    // On Safari starting to slide temporarily triggers text selection mode which
    // show the wrong cursor. We prevent it by stopping the `selectstart` event.
    '(selectstart)': '$event.preventDefault()',
  }
})
export class LySlider implements OnChanges, OnInit, OnDestroy, ControlValueAccessor {

  /**
   * Identifier used to attribute a touch event to a particular slider.
   * Will be undefined if one of the following conditions is true:
   * - The user isn't dragging using a touch device.
   * - The browser doesn't support `Touch.identifier`.
   * - Dragging hasn't started yet.
   */
  private _touchId: number | undefined;

   /** Keeps track of the last pointer event that was captured by the slider. */
  private _lastPointerEvent: MouseEvent | TouchEvent | null;

  /** Used to subscribe to global move and end events */
  protected _document: Document;

  /** The dimensions of the slider. */
  private _sliderDimensions: ClientRect | null = null;

  /** Whether or not to show the thumb. */
  @Input()
  get thumbVisible() {
    return this._thumbVisible;
  }
  set thumbVisible(val: boolean | null) {
    const newVal = val != null ? toBoolean(val) : null;

    if (newVal !== this.thumbVisible) {

      const { thumbVisible: thumbVisibleClass } = this.classes;
      const { thumbNotVisible: thumbNotVisibleClass } = this.classes;
      this._thumbVisible = newVal;

      this.sRenderer.toggleClass(thumbVisibleClass, newVal === true);
      this.sRenderer.toggleClass(thumbNotVisibleClass, newVal === false);

    }
  }

  /** Whether or not to show the marks, also accepts an array of marks. */
  @Input()
  get marks() {
    return this._marks;
  }
  set marks(val: boolean | LySliderMark[]) {
    const newVal = toBoolean(val);

    if (newVal !== this.marks) {

      const newClass = this.classes.marked;

      if (newVal) {
        this._renderer.addClass(this._el.nativeElement, newClass);
        this._marksClass = newClass;
        this._marks = Array.isArray(val) ? val : newVal;
      } else if (this._marksClass) {
        this._marks = false;
        this._renderer.removeClass(this._el.nativeElement, newClass);
        this._marksClass = null;
      }
      if (Array.isArray(newVal)) {
        this._marksList = val as LySliderMark[];
      } else {
        this._marksList = null;
      }
    }

  }

  /** The maximum value that the slider can have. */
  @Input()
  get max(): number {
    return this._max;
  }
  set max(v: number) {
    this._max = toNumber(v, this._max);
    this._updateThumbs();

    this._cd.markForCheck();
  }

  /** The minimum value that the slider can have. */
  @Input()
  get min(): number {
    return this._min;
  }
  set min(v: number) {
    this._min = toNumber(v, this._min);

    // If the value wasn't explicitly set by the user, set it to the min.
    if (this._value === null) {
      this.value = this._min;
    }
    this._updateThumbs();

    this._cd.markForCheck();
  }

  /** The slider appearance style. */
  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      this._appearanceClass = this.sRenderer.add(
        `${LySlider.и}.appearance:${val}`,
        (theme: ThemeVariables & LySliderVariables, ref) => {
          const classes = ref.selectorsOf(STYLES);
          if (theme.slider && theme.slider.appearance) {
            const appearance = theme.slider.appearance[val];
            if (appearance) {
              return appearance instanceof StyleCollection
                ? appearance.setTransformer((_) => _(classes)).css
                : appearance(classes, );
            }
          }
          throw new Error(`${val} not found in theme.slider.appearance`);
      }, STYLE_PRIORITY, this._appearanceClass);
    }
  }
  get appearance() {
    return this._appearance;
  }

  /** Color of Slider */
  @Input()
  get color(): string {
    return this._color;
  }
  set color(val: string) {
    this._color = val;
    const styleKey = `${LySlider.и}.color:${val}`;

    const newStyle = (theme: ThemeVariables & LySliderVariables, ref: ThemeRef) => {
      const color = theme.colorOf(val);
      const contrast = theme.colorOf(`${val}:contrast`);
      const __ = ref.selectorsOf(STYLES);

      if (theme.slider && theme.slider.color) {
        const sliderColor = theme.slider.color;
        if (sliderColor) {
          return sliderColor instanceof StyleCollection
            ? (sliderColor).setTransformer((_) => _(__, color, contrast)).css
            : sliderColor(__, color, contrast);
        }
      }
      throw new Error(`${val} not found in theme.slider.color`);
    };
    this._colorClass = this.sRenderer.add(
      styleKey,
      newStyle,
      STYLE_PRIORITY + 1,
      this._colorClass
    );
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
    this._updateThumbs();

    this._cd.markForCheck();
  }

  /** The values at which the thumb will snap. */
  @Input()
  get step(): number { return this._step; }
  set step(v: number) {
    this._step = toNumber(v, this._step);

    this._stepPrecision = this._step % 1 !== 0
      ? this._step.toString().split('.')[1].length
      : null;

    this._cd.markForCheck();
  }

  /**
   * Value of a slider, this can be a number or an array of numbers.
   * If the array of numbers has more than one value,
   * then this will create more thumbs
   */
  @Input()
  get value() {
    return this._value;
  }
  set value(val: number | (number | null)[] | null) {
    if (val !== this._value) {
      const valueIsArray = Array.isArray(val);
      if (typeof val === 'number') {
        let newValue = Number(val);
        newValue = (newValue === this.min || newValue === this.max)
          ? newValue
          : parseFloat(newValue.toFixed(this._stepPrecision as number));
        this._value = newValue;
      } else if (valueIsArray && !arrayEquals(this._value, val)) {
        let newValue = val as number[];
        newValue = newValue.map(
          _val => _val === null
            ? _val
            : (_val === this.min || _val === this.max)
              ? _val
              : parseFloat(_val.toFixed(this._stepPrecision as number)));

        this._value = newValue;
      }
      this._thumbs = (valueIsArray ?
        this._value as (number | null)[]
        : [this._value as number | null]).map((v, index) => ({
          index,
          value: toNumber(v, this.min),
          displayValue: null,
          percent: null,
          styles: {},
          focused: this._thumbs?.[index]?.focused
        }));

      this._updateThumbs();

      this._cd.markForCheck();
    }
  }

  /** Whether the slider is disabled. */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: boolean) {
    const newVal = toBoolean(val);

    if (newVal !== this.disabled) {
      this._disabled = newVal;
      if (newVal) {
        // TODO: remove promise when color parameter removed
        Promise.resolve(null).then(() => {
          // TODO: deprecated
          const color = this.color;
          const styleKey = `${LySlider.и}.disabled:${val}-${color}`;
          let newStyle: ((theme: ThemeVariables & LySliderVariables, ref: ThemeRef) => StyleTemplate);
          newStyle = (theme: ThemeVariables & LySliderVariables, ref: ThemeRef) => {
            const clr = theme.colorOf(color);
            const __ = ref.selectorsOf(STYLES);

            if (theme.slider && theme.slider.disabled) {
              const sliderColor = theme.slider.disabled;
              if (sliderColor) {
                return sliderColor instanceof StyleCollection
                  ? (sliderColor).setTransformer((_) => _(__, clr)).css
                  : sliderColor(__, clr);
              }
            }
            throw new Error(`${val} not found in theme.slider.color`);
          };
          const newClass = this.sRenderer.add(
            styleKey,
            newStyle,
            STYLE_PRIORITY + 1.5,
            this._disabledClass
          );
          this.sRenderer.addClass(this.classes.disabled);
          this._disabledClass = newClass;
        });
      } else if (this._disabledClass) {
        this.sRenderer.removeClass(this._disabledClass);
        this.sRenderer.removeClass(this.classes.disabled);
        this._disabledClass = null;
      }
    }
  }

  /**
   * Whether or not to show the thumb label, but if the value is a number,
   * it will show ticks according to the steps. For example: if you set
   * 3 ticks with a step of 10, you will draw a tick every 30 values
   */
  @Input()
  get ticks() {
    return this._ticks;
  }
  set ticks(val: number | boolean) {
    const newValue = toNumber(val, toBoolean(val));
    this._ticks = newValue;
  }
  get _tickList() {
    return this.__tickList;
  }
  // private _ngClass: NgClass;
  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
    readonly sRenderer: StyleRenderer,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) _document: any,
    @Optional() @Inject(LY_SLIDER_DEFAULT_OPTIONS) private _default: LySliderDefaultOptions
  ) {
    this._document = _document;
    _renderer.addClass(_el.nativeElement, this.classes.root);
    _ngZone.runOutsideAngular(() => {
      const element = _el.nativeElement;
      element.addEventListener('mousedown', this._pointerDown, activeEventOptions);
      element.addEventListener('touchstart', this._pointerDown, activeEventOptions);
    });
  }
  static и = 'LySlider';
  readonly classes = this._theme.renderStyleSheet(STYLES);

  private _disabled: boolean;
  private _disabledClass: string | null;
  private _color: string;
  private _colorClass: string;

  private _vertical: boolean;
  private _verticalClass?: string | null;

  private _appearance: string;
  private _appearanceClass: string;

  private _value: number | (number | null)[] | null = null;
  private _thumbsOnSlideStart: Thumb[] | null;
  private _valueOnSlideStart: number | (number | null)[] | null;

  private _min: number = 0;
  private _max: number = 100;

  private _step: number = 1;
  private _stepPrecision?: number | null;

  private _closestIndex: number | null;

  _changes = new Subject<void>();

  /** Min percentage, this is for mark. */
  _minPercent: number;
  /** Max percentage, this is for mark. */
  _maxPercent: number;

  /**
   * Whether or not the thumb is sliding.
   */
  _isSliding: 'keyboard' | 'pointer' | null = null;
  _slidingThumbValue?: number | null;

  _thumbs: Thumb[] = [];

  _rootClasses = new Set<string>();

  @ViewChild('bg') _bg?: ElementRef<HTMLDivElement>;
  @ViewChild('track', { static: true }) _track: ElementRef<HTMLDivElement>;
  @ViewChild('ticksRef', { static: true }) _ticksRef: ElementRef<HTMLDivElement>;
  @ViewChildren('thumbsRef') _thumbsRef?: QueryList<ElementRef<HTMLDivElement>>;

  @Input() displayWith: (value: number | null) => string | number;

  /** Event emitted when the slider value has changed. */
  @Output() readonly change: EventEmitter<LySliderChange> = new EventEmitter<LySliderChange>();

  /** Event emitted when the slider thumb moves. */
  @Output() readonly input: EventEmitter<LySliderChange> = new EventEmitter<LySliderChange>();

  /** @docs-private */
  @Output() readonly valueChange: EventEmitter<number | (number | null)[] | null> = new EventEmitter<number | (number | null)[] | null>();

  private _thumbVisible: boolean | null;

  private _marks: boolean | LySliderMark[];
  private _marksClass: string | null;
  _marksList?: LySliderMark[] | null;
  private _ticks: number | boolean;
  _tickInterval: number;
  private __tickList: number[];

  /** Called when the window has lost focus. */
  private _windowBlur = () => {
    // If the window is blurred while dragging we need to stop dragging because the
    // browser won't dispatch the `mouseup` and `touchend` events anymore.
    if (this._lastPointerEvent) {
      this._pointerUp(this._lastPointerEvent);
    }
  }

  /**
   * The registered callback function called when a blur event occurs on the input element.
   * @docs-private
   */
  onTouched = () => {};

  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  ngOnChanges() {
    this._updateTickValues();
    this._changes.next();
  }

  ngOnInit() {

    this._theme.directionChanged.pipe(untilComponentDestroyed(this)).subscribe(() => {
      this.ngOnChanges();
      this._updateThumbs();
      this._cd.markForCheck();
    });

    /** Set default appearance */
    if (this.appearance == null) {
      this.appearance = (this._default && this._default.appearance) || 'standard';
    }

    /** Set horizontal slider */
    if (this.vertical == null) {
      this.vertical = false;
    }

    /** Set default color */
    if (this.color == null) {
      this.color = 'accent';
    }

    /** Set default step */
    if (this.step == null) {
      this.step = 1;
    }
  }

  ngOnDestroy() {
    const element = this._el.nativeElement;
    element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
    element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
    this._lastPointerEvent = null;
    this._changes.complete();
  }

  writeValue(value: any): void {
    this.value = value;
    this._changes.next();
  }

  /**
   * Registers a function called when the control value changes.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: (value: any) => any): void {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a function called when the control is touched.
   *
   * @param fn The callback function
   */
  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  /**
   * Disables the select. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  _onMouseenter() {
    if (this.disabled) {
      return;
    }

    // We save the dimensions of the slider here so we can use them to update the spacing of the
    // ticks and determine where on the slider click and slide events happen.
    this._sliderDimensions = this._getSliderDimensions();
    // this._updateTickIntervalPercent();
  }

  _onFocus() {
    // We save the dimensions of the slider here so we can use them to update the spacing of the
    // ticks and determine where on the slider click and slide events happen.
    this._sliderDimensions = this._getSliderDimensions();
    // this._updateTickIntervalPercent();
  }

  _onBlur() {
    this.onTouched();
  }

  _onKeydown(event: KeyboardEvent) {
    if (
      this.disabled ||
      hasModifierKey(event) ||
      (this._isSliding && this._isSliding !== 'keyboard')
    ) {
      return;
    }
    this._isSliding = 'keyboard';
    const oldValue = this.value;

    switch (event.keyCode) {
      case PAGE_UP:
        this._increment(10);
        break;
      case PAGE_DOWN:
        this._increment(-10);
        break;
      case END:
        this.value = this.max;
        break;
      case HOME:
        this.value = this.min;
        break;
      case LEFT_ARROW:
        this._increment(this._getDirection() === Dir.rtl ? 1 : -1);
        break;
      case UP_ARROW:
        this._increment(1);
        break;
      case RIGHT_ARROW:
        // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
        this._increment(this._getDirection() === Dir.rtl ? -1 : 1);
        break;
      case DOWN_ARROW:
        this._increment(-1);
        break;
      default:
        // Return if the key is not one that we explicitly handle to avoid calling preventDefault on
        // it.
        return;
    }

    if (!valueEquals(oldValue, this.value)) {
      this._emitInputEvent();
      this._emitChangeEvent();
    }

    event.preventDefault();
  }

  _onKeyup() {
    if (this._isSliding === 'keyboard') {
      this._renderer.removeClass(this._el.nativeElement, this.classes.sliding);
      this._isSliding = null;
      this._thumbsOnSlideStart = null;
      this._valueOnSlideStart = null;
      this._closestIndex = null;
    }
  }

  private _pointerDown = (event: TouchEvent | MouseEvent) => {
    // Don't do anything if the slider is disabled or the
    // user is using anything other than the main mouse button.
    if (this.disabled || this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
      return;
    }

    this._ngZone.run(() => {
      this._touchId = isTouchEvent(event)
        ? getTouchIdForSlider(event, this._el.nativeElement)
        : undefined;
      const pointerPosition = getPointerPositionOnPage(event, this._touchId);

      if (pointerPosition) {
        const oldValue = this.value;
        this._isSliding = 'pointer';
        this._lastPointerEvent = event;
        event.preventDefault();
        this._focusHostElement();
        this._onMouseenter(); // Simulate mouseenter in case this is a mobile device.
        this._bindGlobalEvents(event);
        this._focusHostElement();
        this._setOnSlideStart();
        this._updateValueFromPosition(pointerPosition.x, pointerPosition.y);

        // Emit a change and input event if the value changed.
        if (!valueEquals(oldValue, this.value)) {
          this._emitInputEvent();
          this._changes.next();
        }
      }
    });
  }

   /**
   * Called when the user has moved their pointer after
   * starting to drag. Bound on the document level.
   */
  private _pointerMove = (event: TouchEvent | MouseEvent) => {
    if (this._isSliding === 'pointer') {
      const pointerPosition = getPointerPositionOnPage(event, this._touchId);

      if (pointerPosition) {
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        const oldValue = this.value;
        this._lastPointerEvent = event;
        this._updateValueFromPosition(pointerPosition.x, pointerPosition.y);

        // Native range elements always emit `input` events when the value changed while sliding.
        if (!valueEquals(oldValue, this.value)) {
          this._emitInputEvent();
          this._changes.next();
        }
      }
    }
  }

  /** Called when the user has lifted their pointer. Bound on the document level. */
  private _pointerUp = (event: TouchEvent | MouseEvent) => {
    if (this._isSliding === 'pointer') {
      if (
        !isTouchEvent(event) ||
        typeof this._touchId !== 'number' ||
        // Note that we use `changedTouches`, rather than `touches` because it
        // seems like in most cases `touches` is empty for `touchend` events.
        findMatchingTouch(event.changedTouches, this._touchId)
      ) {
        event.preventDefault();
        this._removeGlobalEvents();
        this._isSliding = null;
        this._touchId = undefined;
        this._renderer.removeClass(this._el.nativeElement, this.classes.sliding);

        if (!valueEquals(this._valueOnSlideStart, this.value) && !this.disabled) {
          this._emitChangeEvent();
          this._changes.next();
        }

        this._thumbsOnSlideStart = null;
        this._closestIndex = null;
        this._valueOnSlideStart = this._lastPointerEvent = null;
      }
    }
  }

  _onFocusThumb(thumb: Thumb) {
    if (!this.disabled) {
      thumb.focused = true;
    }
  }

  _onBlurThumb(thumb: Thumb) {
    if (!this.disabled ) {
      thumb.focused = false;
    }
  }


  private _setOnSlideStart() {
    if (!this._valueOnSlideStart) {

      this._renderer.addClass(this._el.nativeElement, this.classes.sliding);

      // clone
      this._valueOnSlideStart = Array.isArray(this.value) ? this.value.slice(0) : this.value;
      this._thumbsOnSlideStart = this._thumbs.slice(0).map(t => ({...t}));
    }
  }


  _trackByFn(_index: number, item: Thumb) {
    return item.index;
  }

  private _getDirection() {
    return this._theme.variables.direction;
  }

  private _updateValueFromPosition(x: number, y: number) {

    if (!this._sliderDimensions) {
      return;
    }

    const w = this._sliderDimensions!.width;
    const h = this._sliderDimensions!.height;
    x -= this._sliderDimensions.left;
    y -= this._sliderDimensions.top;

    let percent = clamp(
      this.vertical
        ? гvalueToPercent(y, 0, h)
        : гvalueToPercent(x, 0, w),
      0,
      100);

    if (this.vertical || (!this.vertical && this._theme.variables.direction === Dir.rtl)) {
      percent = 100 - percent;
    }

    let value: number;

    if (percent === 0) {
      value = this.min;
    } else if (percent === 100) {
      value = this.max;
    } else {
      value = this._roundValueToStep(percentToValue(percent, this.min, this.max));
    }
    if (this._closestIndex == null) {
      this._closestIndex = findClosest(this._thumbs.map(thumb => thumb.value), value);
    }
    const currentThumb = this._thumbsOnSlideStart![this._closestIndex];
    this._slidingThumbValue = currentThumb.value = value;
    if (Array.isArray(this.value)) {
      this.value = this._thumbsOnSlideStart!.map(thumb => thumb.value).sort(ASC);
    } else {
      this.value = value;
    }

    // focus slidingThumb
    const currentSlidingThumb: Thumb | undefined = this._thumbs.find(thumb => thumb.value === value)!;
    if (currentSlidingThumb) {
      currentSlidingThumb.focused = true;
      this._thumbsRef!.toArray()[currentSlidingThumb.index].nativeElement.focus();
    }
  }

  private _updateThumbs() {
    this._thumbs.forEach(thumb => {
      const val = clamp(thumb.value, this.min, this.max);
      const percent = гvalueToPercent(val, this.min, this.max);
      const pos = this._calculatePosition(percent);
      thumb.value = val;
      thumb.displayValue = this._transformValue(val);
      thumb.percent = percent;
      if (this._isSliding === 'pointer') {
        thumb.focused = false;
      }
      thumb.styles = {
        [pos.style]: pos.value
      };
    });

    this._updateTrack();
  }

  _calculatePosition(percent: number) {
    let style: string;
    const value = `${percent}%`;

    if (this.vertical) {
      style = 'bottom';
    } else {
      style = this._theme.variables.direction === 'rtl' ? 'right' : 'left';
    }
    return {
      style,
      value
    };
  }

  private _updateTrack() {
    const track = this._track;
    const thumbs = this._thumbs;
    const thumbsPercents = thumbs.map(thumb => thumb.percent!);
    // const direction = this._theme.variables.direction === 'rtl' ? 'right' : 'left';
    const axis = this.vertical ? 'Y' : 'X';
    const sign = this._theme.variables.direction === 'rtl' ? '-' : '';
    if (thumbs.length === 1) {
      thumbsPercents.unshift(0);
    }

    const minPercent = this._minPercent = Math.min(...thumbsPercents);
    const maxPercent = this._maxPercent = Math.max(...thumbsPercents);
    const percent = (maxPercent / 100) - (minPercent / 100);

    const scale = this.vertical ? `1, ${percent}, 1` : `${percent}, 1, 1`;
    if (track) {
      track.nativeElement.style.transform = `translate${axis}(${sign}${minPercent}%) scale3d(${scale})`;
    }
  }

  /** Emits a change event. */
  private _emitChangeEvent() {
    this._controlValueAccessorChangeFn(this.value);
    this.valueChange.emit(this.value);
    this.change.emit(this._createChangeEvent());
  }

  /** Emits an input event. */
  private _emitInputEvent() {
    this.input.emit(this._createChangeEvent());
  }

  private _createChangeEvent(value = this.value) {
    return new LySliderChange(this, value);
  }

  private _roundValueToStep(value: number) {
    return Number((Math.round(value / this.step) * this.step).toFixed(this._stepPrecision!));
  }

  private _transformValue(value: number) {
    if (this.displayWith) {
      return this.displayWith(value);
    }
    return value;
  }

  /** Increments the slider by the given number of steps (negative number decrements). */
  private _increment(numSteps: number) {
    this._setOnSlideStart();
    if (this._closestIndex == null) {
      this._closestIndex = this._thumbsOnSlideStart!.findIndex(_ => _.focused);
    }
    const index = this._closestIndex;
    const thumb = this._thumbsOnSlideStart![index];
    const newValue = clamp((thumb.value || 0) + this.step * numSteps, this.min, this.max);
    thumb.value = newValue;
    if (Array.isArray(this.value)) {
      this.value = this._thumbsOnSlideStart!.map(_ => _.value).sort(ASC);
    } else {
      this.value = newValue;
    }

    // focus slidingThumb
    const currentSlidingThumb: Thumb | undefined = this._thumbs.find(t => t.value === newValue)!;
    if (currentSlidingThumb) {
      currentSlidingThumb.focused = true;
      this._thumbsRef?.forEach((t, i) => {
        if (i === currentSlidingThumb.index) {
          t.nativeElement.focus();
        } else {
          this._thumbs[i].focused = false;
        }
      });
    }
  }

  _getHostElement() {
    return this._el.nativeElement;
  }

  /**
   * Get the bounding client rect of the slider track element.
   * The track is used rather than the native element to ignore the extra space that the thumb can
   * take up.
   */
   private _getSliderDimensions() {
    return this._bg ? this._bg.nativeElement.getBoundingClientRect() : null;
  }

  private _updateTickValues() {
    this.__tickList = [];
    if (!this.ticks || this.step == null) {
      return false;
    } else {
      const ticks = this.ticks;
      this._tickInterval = typeof ticks === 'number'
        ? this.step * ticks
        : this.step;

      this.__tickList = [];
      const stepWidth = this._tickInterval;
      let cu = this.min;
      this.__tickList.push(cu);
      while (cu <= this.max) {
        cu += stepWidth;
        const newVal = clamp(cu, this.min, this.max);
        this.__tickList.push(newVal);
        // Remove duplicate value for next
        if (newVal === this.max) {
          break;
        }
      }
    }

    this._cd.markForCheck();
  }

  /**
   * Focuses the native element.
   */
   private _focusHostElement(options?: FocusOptions) {
    this._el.nativeElement.focus(options);
  }

   /**
   * Binds our global move and end events. They're bound at the document level and only while
   * dragging so that the user doesn't have to keep their pointer exactly over the slider
   * as they're swiping across the screen.
   */
  private _bindGlobalEvents(triggerEvent: TouchEvent | MouseEvent) {
    // Note that we bind the events to the `document`, because it allows us to capture
    // drag cancel events where the user's pointer is outside the browser window.
    const document = this._document;
    const isTouch = isTouchEvent(triggerEvent);
    const moveEventName = isTouch ? 'touchmove' : 'mousemove';
    const endEventName = isTouch ? 'touchend' : 'mouseup';
    document.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
    document.addEventListener(endEventName, this._pointerUp, activeEventOptions);

    if (isTouch) {
      document.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
    }

    const window = this._getWindow();

    if (typeof window !== 'undefined' && window) {
      window.addEventListener('blur', this._windowBlur);
    }
  }

  /** Removes any global event listeners that we may have added. */
  private _removeGlobalEvents() {
    const document = this._document;
    document.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
    document.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
    document.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
    document.removeEventListener('touchend', this._pointerUp, activeEventOptions);
    document.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);

    const window = this._getWindow();

    if (typeof window !== 'undefined' && window) {
      window.removeEventListener('blur', this._windowBlur);
    }
  }

  /** Use defaultView of injected document if available or fallback to global window reference */
  private _getWindow(): Window {
    return this._document.defaultView || window;
  }

}

function findClosest(values: number[], currentValue: number) {
  const { index: closestIndex } = values.reduce<{
    distance: number
    index: number
  } | null>((previousValue, value, index) => {
    const distance = Math.abs(currentValue - value);

    if (previousValue === null || distance < previousValue.distance || distance === previousValue.distance) {
      return {
        distance,
        index,
      };
    }

    return previousValue;
  }, null)!;
  return closestIndex;
}

function percentToValue(percent, min, max) {
  return (max - min) * (percent / 100) + min;
}

function arrayEquals(array1: any, array2: any) {
  return Array.isArray(array1) && Array.isArray(array2) && array1.length === array2.length
    && array1.every((value, index) => value === array2[index]);
}

/** Quickly check if two values are equal */
function valueEquals(value: number | (number | null)[] | null, value2: number | (number | null)[] | null) {
  if (value === value2) {
    return true;
  }
  return arrayEquals(value, value2);
}

function clamp(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function ASC(a: number, b: number) {
  return a - b;
}

/** Returns whether an event is a touch event. */
function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  // This function is called for every pixel that the user has dragged so we need it to be
  // as fast as possible. Since we only bind mouse events and touch events, we can assume
  // that if the event's name starts with `t`, it's a touch event.
  return event.type[0] === 't';
}

/** Gets the unique ID of a touch that matches a specific slider. */
function getTouchIdForSlider(event: TouchEvent, sliderHost: HTMLElement): number | undefined {
  for (let i = 0; i < event.touches.length; i++) {
    const target = event.touches[i].target as HTMLElement;

    if (sliderHost === target || sliderHost.contains(target)) {
      return event.touches[i].identifier;
    }
  }

  return undefined;
}

/** Gets the coordinates of a touch or mouse event relative to the viewport. */
function getPointerPositionOnPage(event: MouseEvent | TouchEvent, id: number | undefined) {
  let point: {clientX: number; clientY: number} | undefined;

  if (isTouchEvent(event)) {
    // The `identifier` could be undefined if the browser doesn't support `TouchEvent.identifier`.
    // If that's the case, attribute the first touch to all active sliders. This should still cover
    // the most common case while only breaking multi-touch.
    if (typeof id === 'number') {
      point = findMatchingTouch(event.touches, id) || findMatchingTouch(event.changedTouches, id);
    } else {
      // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
      point = event.touches[0] || event.changedTouches[0];
    }
  } else {
    point = event;
  }

  return point ? {x: point.clientX, y: point.clientY} : undefined;
}

/** Finds a `Touch` with a specific ID in a `TouchList`. */
function findMatchingTouch(touches: TouchList, id: number): Touch | undefined {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === id) {
      return touches[i];
    }
  }

  return undefined;
}
