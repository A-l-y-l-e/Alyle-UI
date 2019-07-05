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
  ViewChildren } from '@angular/core';
import { LyTheme2,
  ThemeVariables,
  toBoolean,
  LY_COMMON_STYLES,
  getLyThemeStyleUndefinedError,
  HammerInput,
  toNumber,
  StyleDeclarationsBlock, 
  LyHostClass} from '@alyle/ui';
import { SliderVariables } from './slider.config';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';

interface ThemeVariablesWithSlider extends ThemeVariables {
  slider: SliderVariables;
}

export const LY_SLIDER_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LySlider),
  multi: true
};

const STYLE_PRIORITY = -2;
const STYLES = (theme: ThemeVariablesWithSlider) => ({
  $priority: STYLE_PRIORITY,
  root: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    cursor: 'pointer',
    '{bg}': {
      ...LY_COMMON_STYLES.fill,
      margin: 'auto'
    },
    [
      [
        // always show visible thumb, when {thumbVisible} is available
        '&{thumbVisible} {thumb}',
        // on hover
        '&:not({thumbNotVisible}):not({disabled}) {thumbContent}:hover {thumb}',
        // on focused
        '&:not({thumbNotVisible}) {thumbContent}{thumbContentFocused} {thumb}'
      ].join()
    ]: {
      borderRadius: '50% 50% 0%'
    },
    [
      [
        '&{thumbVisible} {thumbContent}::before',
        '&:not({thumbNotVisible}):not({disabled}) {thumbContent}:hover::before',
        '&:not({thumbNotVisible}) {thumbContent}{thumbContentFocused}::before'
      ].join()
    ]: {
      transform: 'scale(1)'
    },
    '&': theme.slider ? theme.slider.root : null
  },

  track: {
    position: 'absolute',
    margin: 'auto'
  },
  bg: { },
  thumbContainer: {
    width: 0,
    height: 0,
    position: 'absolute',
    margin: 'auto'
  },
  thumbContent: {
    '&::before': {
      content: `''`,
      position: 'absolute',
      opacity: .6,
      transform: 'scale(0)',
      transition: `transform ${
        theme.animations.durations.entering
      }ms ${theme.animations.curves.sharp} 0ms, background ${
        theme.animations.durations.complex
      }ms ${theme.animations.curves.sharp} 0ms`
    }
  },
  thumb: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    left: '-6px',
    top: '-6px',
    borderRadius: '50%',
    outline: 0,
    transition: ['border-radius'].map(prop => `${prop} ${
      theme.animations.durations.exiting
    }ms ${theme.animations.curves.standard} 0ms`).join(),
    '&::before': {
      content: `''`,
      ...LY_COMMON_STYLES.fill,
      borderRadius: '50%',
      transition: ['box-shadow'].map(prop => `${prop} ${
        theme.animations.durations.entering
      }ms ${theme.animations.curves.sharp} 0ms`).join()
    }
  },
  thumbLabel: {
    position: 'absolute',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    top: '-14px',
    left: '-14px',
    transition: ['transform', 'top', 'left', 'border-radius'].map(prop => `${prop} ${
      theme.animations.durations.entering
    }ms ${theme.animations.curves.sharp} 0ms`).join()
  },
  thumbLabelValue: {
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff'
  },

  horizontal: {
    width: '120px',
    height: '2px',
    padding: '10px 0',
    touchAction: 'pan-y !important',
    '& {track}, & {bg}': {
      height: '2px',
      width: '100%'
    },
    '{track}': {
      before: 0,
      top: 0,
      bottom: 0
    },
    '& {thumb}': {
      transform: 'rotateZ(-135deg)'
    },

    '{thumbLabel}': {
      transform: 'rotateZ(45deg) scale(0)',
    },
    [
      [
        // always show visible thumb, when {thumbVisible} is available
        '&{thumbVisible} {thumbLabel}',
        // on hover
        '&:not({disabled}) {thumbContent}:hover {thumbLabel}',
        // on focused
        '& {thumbContent}{thumbContentFocused} {thumbLabel}'
      ].join()
    ]: {
      borderRadius: '50% 50% 0%',
      top: '-50px',
      transform: 'rotateZ(45deg) scale(1)'
    },

    '& {thumbLabelValue}': {
      transform: 'rotateZ(-45deg)'
    },
    '{thumbContainer}': {
      top: 0,
      bottom: 0
    },
    '& {thumbContent}::before': {
      width: '2px',
      height: '24px',
      left: '-1px',
      top: '-24px'
    },

    '{tick}': {
      width: '2px',
      height: 'inherit',
      top: 0,
      bottom: 0,
    },
    '{mark}': {
      top: '22px',
      transform: 'translateX(-50%)',
    },
    '&{marked}': {
      marginBottom: '24px'
    }
  },
  vertical: {
    width: '2px',
    height: '120px',
    padding: '0 10px',
    touchAction: 'pan-x !important',
    '& {track}, & {bg}': {
      height: '100%',
      width: '2px'
    },
    '{track}': {
      bottom: 0,
      left: 0,
      right: 0
    },
    '& {thumb}': {
      transform: 'rotateZ(135deg)'
    },
    '& {thumbLabel}': {
      transform: 'rotateZ(-45deg) scale(0)'
    },
    [
      [
        // always show visible thumb, when {thumbVisible} is available
        '&{thumbVisible} {thumbLabel}',
        // on hover
        '&:not({disabled}) {thumbContent}:hover {thumbLabel}',
        // on focused
        '& {thumbContent}{thumbContentFocused} {thumbLabel}'
      ].join()
    ]: {
      borderRadius: '50% 50% 0%',
      left: '-50px',
      transform: 'rotateZ(-45deg) scale(1)'
    },

    '& {thumbLabelValue}': {
      transform: 'rotateZ(45deg)'
    },
    '{thumbContainer}': {
      left: 0,
      right: 0
    },
    '{thumbContent}::before': {
      width: '24px',
      height: '2px',
      left: '-24px',
      top: '-1px'
    },
    '{tick}': {
      width: 'inherit',
      height: '2px',
      left: 0,
      right: 0
    },
    '{mark}': {
      left: '22px',
      transform: 'translateY(-50%)',
    },
    '&{marked}': {
      marginRight: '24px'
    }
  },

  marked: { },
  mark: {
    position: 'absolute',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    color: theme.text.secondary
  },
  markActive: {
    color: 'currentColor'
  },
  tick: {
    position: 'absolute',
    margin: 'auto'
  },
  tickActive: {},

  thumbVisible: null,
  thumbNotVisible: null,
  thumbContentFocused: null,
  sliding: null,
  disabled: {
    cursor: 'default'
  }
});

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
    LyHostClass
  ],
  host: {
    '(slide)': '_onSlide($event)',
    '(slideend)': '_onSlideEnd()',
    '(tap)': '_onTap($event)'
  }
})
export class LySlider implements OnChanges, OnInit, OnDestroy, ControlValueAccessor {
  static и = 'LySlider';
  readonly classes = this._theme.addStyleSheet(STYLES);

  private _disabled: boolean;
  private _disabledClass?: string | null;
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

  @ViewChild('bg', { static: false }) _bg?: ElementRef<HTMLDivElement>;
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

      this._hostClass.toggle(thumbVisibleClass, newVal === true);
      this._hostClass.toggle(thumbNotVisibleClass, newVal === false);

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

  /** Color of Slider */
  @Input()
  get color() {
    return this._color;
  }
  set color(val: string) {
    this._color = val;
    const appearance = this.appearance;
    const styleKey = `${LySlider.и}.color:${val}`;

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
        const appearance = this.appearance;
        const styleKey = `${LySlider.и}.disabled:${val}`;
        let newStyle: StyleDeclarationsBlock | null;
        if (!this._theme.existStyle(styleKey)) {
          const color = this.color;
          newStyle = (theme: ThemeVariablesWithSlider) => {
            const colorCss = theme.colorOf(color);
            return theme.slider.appearance![appearance].disabled(theme, colorCss);
          };
        }
        const newClass = this._theme.addStyle(
          styleKey,
          newStyle,
          this._el.nativeElement,
          this._disabledClass,
          STYLE_PRIORITY + 2, STYLES);
        this._renderer.addClass(this._getHostElement(), this.classes.disabled);
        this._disabledClass = newClass;
      } else if (this._disabledClass) {
        this._renderer.removeClass(this._getHostElement(), this._disabledClass);
        this._renderer.removeClass(this._getHostElement(), this.classes.disabled);
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
    private _hostClass: LyHostClass
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }

  ngOnChanges() {
    this._updateTickValues();
    this._changes.next();
  }

  ngOnInit() {

    /**
     * TODO: update thumbs & rail on change direction (RTL/LTR)
     */

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

    if (!valueEquals(this._valueOnSlideStart, this.value) && !this.disabled) {
      this._emitInputEvent();
      this._changes.next();
    }
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

    if (this.vertical) {
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
    const currentSlidingThumb = this._thumbs.find(thumb => thumb.value === value)!;
    currentSlidingThumb.focused = true;
    this._thumbsRef!.toArray()[currentSlidingThumb.index].nativeElement.focus();
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

      track.nativeElement.style.width = null;
      track.nativeElement.style.height = null;
      track.nativeElement.style.left = null;
      track.nativeElement.style.right = null;

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
