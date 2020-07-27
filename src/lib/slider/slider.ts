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
  Optional} from '@angular/core';
import { LyTheme2,
  ThemeVariables,
  toBoolean,
  LY_COMMON_STYLES,
  HammerInput,
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

export interface LySliderTheme {
  /** Styles for Slider Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  disabled?: StyleCollection<((classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate);
  color?: StyleCollection<((classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate);
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
  return {
    $priority: STYLE_PRIORITY,
    root: () => lyl `{
      display: inline-block
      position: relative
      box-sizing: border-box
      cursor: pointer
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

    track: lyl `{
      position: absolute
      margin: auto
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
    StyleRenderer
  ],
  host: {
    '(slide)': '_onSlide($event)',
    '(slideend)': '_onSlideEnd()',
    '(tap)': '_onTap($event)'
  }
})
export class LySlider implements OnChanges, OnInit, OnDestroy, ControlValueAccessor {
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
  private _currentRect: DOMRect | null;

  _changes = new Subject<void>();

  /** Min percentage, this is for mark. */
  _minPercent: number;
  /** Max percentage, this is for mark. */
  _maxPercent: number;

  /**
   * Whether or not the thumb is sliding.
   */
  _isSliding: boolean;
  _slidingThumbValue?: number | null;

  _thumbs: Thumb[] = [];

  _rootClasses = new Set<string>();

  @ViewChild('bg', { static: false}) _bg?: ElementRef<HTMLDivElement>;
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

  /**
   * The registered callback function called when a blur event occurs on the input element.
   * @docs-private
   */
  onTouched = () => {};

  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

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

  private _thumbVisible: boolean | null;

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

  private _marks: boolean | LySliderMark[];
  private _marksClass: string | null;
  _marksList?: LySliderMark[] | null;

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
      this._appearanceClass = this._sr.add(
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
      const __ = ref.selectorsOf(STYLES);

      if (theme.slider && theme.slider.color) {
        const sliderColor = theme.slider.color;
        if (sliderColor) {
          return sliderColor instanceof StyleCollection
            ? (sliderColor).setTransformer((_) => _(__, color)).css
            : sliderColor(__, color);
        }
      }
      throw new Error(`${val} not found in theme.slider.color`);
    };
    this._colorClass = this._sr.add(
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
        newValue = parseFloat(newValue.toFixed(this._stepPrecision as number));
        this._value = newValue;
      } else if (valueIsArray && !arrayEquals(this._value, val)) {
        let newValue = val as number[];
        newValue = newValue.map(
          _val => _val === null
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
          styles: {}
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
        const newClass = this._sr.add(
          styleKey,
          newStyle,
          STYLE_PRIORITY + 1.5,
          this._disabledClass
        );
        this.sRenderer.addClass(this.classes.disabled);
        this._disabledClass = newClass;
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
  private _ticks: number | boolean;
  _tickInterval: number;
  get _tickList() {
    return this.__tickList;
  }
  private __tickList: number[];
  // private _ngClass: NgClass;
  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
    readonly sRenderer: StyleRenderer,
    private _sr: StyleRenderer,
    @Optional() @Inject(LY_SLIDER_DEFAULT_OPTIONS) private _default: LySliderDefaultOptions
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }

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

  _onFocus(thumb: Thumb) {
    if (!this.disabled) {
      thumb.focused = true;
    }
  }

  _onBlur(thumb: Thumb) {
    if (!this.disabled) {
      thumb.focused = false;
    }
  }

  _onTap(event: HammerInput) {
    if (this.disabled) {
      return;
    }
    this._startSlide();
    this._updateValueFromPosition(event.center.x, event.center.y);
    this._onSlideEnd();
  }

  _onSlide(event: HammerInput) {
    if (this.disabled) {
      return;
    }

    this._startSlide();

    if (event['isFinal']) {
      if (event['pointerType'] === 'touch' && event.center.x === 0 && event.center.y === 0) {
        // restore to initial position
        this.value = this._valueOnSlideStart;
      } else {
        this._updateValueFromPosition(event.center.x, event.center.y);
      }
      this._onSlideEnd();
    } else {
      this._updateValueFromPosition(event.center.x, event.center.y);
    }


    event.preventDefault();

    this._emitInputEvent();
    this._changes.next();
  }

  private _startSlide() {
    if (!this._isSliding) {
      this._isSliding = true;
      this._renderer.addClass(this._el.nativeElement, this.classes.sliding);

      // clone
      this._valueOnSlideStart = Array.isArray(this.value) ? this.value.slice(0) : this.value;

      this._thumbsOnSlideStart = this._thumbs.slice(0).map(t => ({...t}));
      this._currentRect = this._bg!.nativeElement.getBoundingClientRect() as DOMRect;
    }
  }

  _onSlideEnd() {
    if (this._isSliding) {
      this._isSliding = false;
      this._renderer.removeClass(this._el.nativeElement, this.classes.sliding);

      if (!valueEquals(this._valueOnSlideStart, this.value) && !this.disabled) {
        this._emitChangeEvent();
        this._changes.next();
      }
      this._thumbsOnSlideStart = null;
      this._valueOnSlideStart = null;
      this._closestIndex = null;
      this._currentRect = null;
    }
  }

  _trackByFn(_index: number, item: Thumb) {
    return item.index;
  }

  private _updateValueFromPosition(x: number, y: number) {
    if (!this._bg) {
      return;
    }

    const w = this._currentRect!.width;
    const h = this._currentRect!.height;
    x -= this._currentRect!.x;
    y -= this._currentRect!.y;

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
      thumb.focused = false;
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
    const direction = this._theme.variables.direction === 'rtl' ? 'right' : 'left';

    if (thumbs.length === 1) {
      thumbsPercents.unshift(0);
    }

    const minPercent = this._minPercent = Math.min(...thumbsPercents);
    const maxPercent = this._maxPercent = Math.max(...thumbsPercents);

    if (track) {

      track.nativeElement.style.width = null!;
      track.nativeElement.style.height = null!;
      track.nativeElement.style.left = null!;
      track.nativeElement.style.right = null!;

      if (this.vertical) {
        track.nativeElement.style.height = `${(maxPercent - minPercent)}%`;
        track.nativeElement.style.bottom = `${minPercent}%`;
      } else {
        track.nativeElement.style.width = `${maxPercent - minPercent}%`;
        track.nativeElement.style[direction] = `${minPercent}%`;
      }
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

  _getHostElement() {
    return this._el.nativeElement;
  }

  private _updateTickValues() {
    this.__tickList = [];
    if (!this.ticks) {
      return false;
    } else {
      const ticks = this.ticks;
      this._tickInterval = typeof ticks === 'number'
        ? this.step * ticks
        : this.step;

      this.__tickList = [];
      const tickIntervals = this._tickInterval + 1;
      const stepWith = this._tickInterval;
      for (let index = 0; index < tickIntervals; index++) {
        this.__tickList.push(clamp(index * stepWith, this.min, this.max));
      }
    }

    this._cd.markForCheck();
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

export function гvalueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min);
}

function percentToValue(percent, min, max) {
  return (max - min) * (percent / 100) + min;
}

function arrayEquals(array1: any, array2: any) {
  return Array.isArray(array1) && Array.isArray(array2) && array1.length === array2.length
    && array1.every((value, index) => value === array2[index]);
}

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

export function гbetween(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

function ASC(a: number, b: number) {
  return a - b;
}
