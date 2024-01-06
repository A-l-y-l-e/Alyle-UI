import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
  } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  LyCoreStyles as LyCommonStyles,
  LyFocusState,
  LyTheme2,
  mixinDisableRipple,
  ThemeVariables,
  ThemeRef,
  lyl,
  StyleRenderer,
  LY_COMMON_STYLES,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  Style,
  WithStyles
  } from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { Platform } from '@angular/cdk/platform';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { LyCheckboxDefaultOptions, LY_CHECKBOX_DEFAULT_OPTIONS, LY_CHECKBOX_DEFAULT_OPTIONS_FACTORY } from './checkbox-config';

const STYLE_PRIORITY = -2;
const DEFAULT_DISABLE_RIPPLE = false;
// Default checkbox configuration.
const defaults = LY_CHECKBOX_DEFAULT_OPTIONS_FACTORY();

/**
 * Represents the different states that require custom transitions between them.
 * @docs-private
 */
export const enum CheckboxState {
  /** The initial state of the component before any user interaction. */
  Init = 'Init',
  /** The state representing the component when it's becoming checked. */
  Checked = 'Checked',
  /** The state representing the component when it's becoming unchecked. */
  Unchecked = 'Unchecked',
  /** The state representing the component when it's becoming indeterminate. */
  Indeterminate = 'Indeterminate',
}

export interface LyCheckboxTheme {
  /** Styles for Checkbox Component. */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  /** Styles that apply when a color is set. */
  color?: (classes: LyClasses<typeof STYLES>, color: Color) => StyleTemplate;
}

export interface LyCheckboxVariables {
  checkbox?: LyCheckboxTheme;
}

export const STYLES = (theme: ThemeVariables & LyCheckboxVariables, ref: ThemeRef) => {
  const checkbox = ref.selectorsOf(STYLES);
  const { after } = theme;
  return {
    $name: LyCheckbox.и,
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      display: inline-flex
      -webkit-tap-highlight-color: transparent
      &${checkbox.disabled}:not(${checkbox.checked}) ${checkbox.icon}:before {
        color: ${theme.disabled.contrast}
      }
      &${checkbox.disabled} {
        pointer-events: none
        ${checkbox.layout} {
          color: ${theme.text.secondary}
        }
      }
      &${checkbox.disabled}${checkbox.indeterminate},
      &${checkbox.disabled}${checkbox.checked} {
        ${checkbox.icon}:before {
          border: 0
          background: ${theme.disabled.contrast}
        }
      }
      &${checkbox.onFocusByKeyboard} ${checkbox.icon}::after {
        box-shadow: 0 0 0 12px
        opacity: .13
        border-radius: 50%
      }
      &:not(${checkbox.checked}) ${checkbox.icon} {
        color: ${theme.text.secondary}
      }
      &${checkbox.checked},
      &${checkbox.indeterminate} {
        ${checkbox.icon}::before {
          background: currentColor
          -webkit-print-color-adjust: exact
          color-adjust: exact
        }
        ${checkbox.icon} polyline {
          stroke-dashoffset: 0
        }
      }
      {
        ...${
          (theme.checkbox
            && theme.checkbox.root
            && (theme.checkbox.root instanceof StyleCollection
              ? theme.checkbox.root.setTransformer(fn => fn(checkbox))
              : theme.checkbox.root(checkbox))
          )
        }
      }
    }`,
    layout: () => lyl `{
      display: inline-flex
      align-items: baseline
      cursor: pointer
      user-select: none
      white-space: nowrap
      ${checkbox.label} {
        user-select: auto
      }
    }`,
    icon: lyl `{
      position: relative
      margin: auto
      margin-${after}: 8px
      width: 16px
      height: 16px
      user-select: none
      &::before, &::after {
        content: ''
        ...${LY_COMMON_STYLES.fill}
        width: 16px
        height: 16px
        margin: auto
        box-sizing: border-box
      }
      &::before {
        border: solid 2px
        border-radius: 2px
      }
      svg {
        position: absolute
        left: 0
        polyline {
          fill: none
          stroke: ${theme.background.primary.default}
          stroke-width: 2
          stroke-linecap: round
          stroke-linejoin: round
          stroke-dasharray: 18px
          stroke-dashoffset: 18px
        }
      }
    }`,
    label: lyl `{
      line-height: 24px
    }`,
    unchecked: null,
    checked: null,
    indeterminate: null,
    input: LY_COMMON_STYLES.visuallyHidden,
    onFocusByKeyboard: null,
    disabled: ( ) => lyl `{
    & ${checkbox.input} {
        visibility: hidden
      }
      & ${checkbox.icon} {
        color: inherit !important
      }
    }`,
    animations: ( ) => lyl `{
      ${checkbox.icon} svg polyline {
        transition: all ${theme.animations.durations.complex}ms ${theme.animations.curves.deceleration}
        transform: rotate(0deg)
        transform-origin: center
      }
    }`,
    indeterminateToUnchecked: null,
    indeterminateToChecked: null,
    checkedToUnChecked: null,
    checkedToIndeterminate: null,
    uncheckedToChecked: null,
    uncheckedToIndeterminate: null,
  };
};

/**
 * This allows it to support [(ngModel)].
 * @ignore
 */
export const LY_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyCheckbox),
  multi: true
};

/** Change event object emitted by LyCheckbox. */
export class LyCheckboxChange {
  /** The source LyCheckbox of the event. */
  source: LyCheckbox;
  /** The new `checked` value of the checkbox. */
  checked: boolean;
}

/** @docs-private */
export class LyCheckboxBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone,
    public _platform: Platform
  ) { }
}

/** @docs-private */
export const LyCheckboxMixinBase = mixinDisableRipple(LyCheckboxBase);

/**
 * @dynamic
 */
@Component({
  selector: 'ly-checkbox',
  templateUrl: 'checkbox.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer,
    LY_CHECKBOX_CONTROL_VALUE_ACCESSOR,
  ],
  exportAs: 'lyCheckbox',
  inputs: [
    'disableRipple'
  ]
})
export class LyCheckbox extends LyCheckboxMixinBase implements WithStyles,
  ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  /** @ignore */
  static readonly и = 'LyCheckbox';
  /**
   * styles
   * @ignore
   */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  protected _color: string;
  protected _colorClass: string;
  protected _checked: boolean;
  protected _disabled;
  private _onFocusByKeyboardState: boolean;
  private _currentCheckState: CheckboxState = CheckboxState.Init;
  private _currentCheckStateClass: string;

  readonly ;

  @ViewChild('innerContainer') _innerContainer: ElementRef<HTMLDivElement>;

  /** The value attribute of the native input element */
  @Input() value: string;

  @Input() name: string | null = null;

  /** Checkbox color when checked */
  @Input()
  @Style<string | null>(
    val => (
      theme: ThemeVariables & LyCheckboxVariables,
      ref: ThemeRef
    ) => {
      const checkbox = ref.selectorsOf(STYLES);
      const color = theme.colorOf(val);
      if (theme.checkbox && theme.checkbox.color) {
        return theme.checkbox.color(checkbox, color);
      }
      throw new Error(`${LyCheckbox.и}: styles theme.checkbox.color is undefined`);
    }
  , STYLE_PRIORITY)
  color: string | null;

  /**
   * Whether the checkbox is checked.
   */
  @Input()
  get checked(): boolean { return this._checked; }
  set checked(val: BooleanInput) {
    const newVal = coerceBooleanProperty(val);
    if (newVal !== this.checked) {
      this._checked = newVal;
      this._updateCheckedState();
      this._markForCheck();
    }
  }

  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: BooleanInput) {
    const newVal = coerceBooleanProperty(value);
    if (newVal !== this.indeterminate) {
      this._indeterminate = newVal;
      this.indeterminateChange.emit(this._indeterminate);
      this._updateCheckboxState();
      this._markForCheck();
    }
  }
  private _indeterminate = false;

  @Input()
  get required() {
    return this._required;
  }
  set required(val: BooleanInput) {
    this._required = coerceBooleanProperty(val);
  }
  private _required: boolean;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: BooleanInput) {
    const newVal = coerceBooleanProperty(val);
    if (newVal !== this.disabled) {
      this._disabled = newVal;
      if (newVal) {
        this._renderer.addClass(this._el.nativeElement, this.classes.disabled);
      } else {
        this._renderer.removeClass(this._el.nativeElement, this.classes.disabled);
      }
      this._markForCheck();
    }
  }

  /** Event emitted when the checkbox's `checked` value changes. */
  @Output() readonly change: EventEmitter<LyCheckboxChange> = new EventEmitter<LyCheckboxChange>();

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output() readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** The native `<input type="checkbox">` element */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  _onTouched: () => any = () => {};
  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  constructor(
    public _commonStyles: LyCommonStyles,
    _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusState: LyFocusState,
    readonly sRenderer: StyleRenderer,
    ngZone: NgZone,
    platform: Platform,
    @Inject(LY_CHECKBOX_DEFAULT_OPTIONS)
    private _options?: LyCheckboxDefaultOptions,
  ) {
    super(_theme, ngZone, platform);
    this._options = this._options || defaults;
    this._triggerElement = this._el;
    this._rippleConfig = {
      centered: true,
      radius: 'containerSize',
      percentageToIncrease: 150
    };
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
    // set default color
    if (!this.color) {
      this.color = this._options?.color || defaults.color!;
    }
  }

  ngAfterViewInit() {
    const focusState = this._focusState.listen(this._inputElement, this._el);
    if (focusState) {
      focusState.subscribe((event) => {
        if (this._onFocusByKeyboardState === true) {
          this._renderer.removeClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
          this._onFocusByKeyboardState = false;
        }
        if (event === 'keyboard') {
          this._onFocusByKeyboardState = true;
          this._renderer.addClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
        }
        this._onTouched();
      });
    }

    this._rippleContainer = this._innerContainer;

    // set default disable ripple
    if (this.disableRipple == null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
    this._renderer.addClass(this._el.nativeElement, this.classes.animations);
  }

  ngOnDestroy() {
    this._focusState.unlisten(this._el);
    this._removeRippleEvents();
  }

  /** @docs-private */
  writeValue(value: any): void {
    this.checked = !!value;
  }

  /** @docs-private */
  registerOnChange(fn: (value: any) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  /** @docs-private */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /** @docs-private */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle() {
    this.checked = !this.checked;
    this._controlValueAccessorChangeFn(this.checked);
  }

  _onInputClick(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      if (this.indeterminate) {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this._updateCheckboxState();
          this.indeterminateChange.emit(this._indeterminate);
        });
      }
      this.checked = !this.checked;
      this._emitChangeEvent();
    }
    this._markForCheck();
  }

  _onChange(event: Event) {
    event.stopPropagation();
  }

  private _emitChangeEvent() {
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit({
      source: this,
      checked: this.checked
    });
  }

  private _updateCheckedState() {
    this.sRenderer.toggleClass(this.classes.checked, !!this.checked);
    this.sRenderer.toggleClass(this.classes.unchecked, !this.checked);
  }

  private _updateCheckboxState() {
    const oldState = this._currentCheckState;
    const newState = this.indeterminate
      ? CheckboxState.Indeterminate
      : this.checked
        ? CheckboxState.Checked
        : CheckboxState.Unchecked;
    if (oldState === newState) {
      return;
    }
    this.sRenderer.toggleClass(this.classes.indeterminate, newState === CheckboxState.Indeterminate);

    let newClass: null | string = null;
    switch (oldState) {
      case CheckboxState.Init:
        break;
      case CheckboxState.Indeterminate:
        newClass = newState === CheckboxState.Checked
          ? this.classes.indeterminateToChecked
          : this.classes.indeterminateToUnchecked;
        break;
      case CheckboxState.Checked:
        newClass = newState === CheckboxState.Indeterminate
          ? this.classes.checkedToIndeterminate
          : this.classes.checkedToUnChecked;
        break;
      case CheckboxState.Unchecked:
        newClass = newState === CheckboxState.Indeterminate
          ? this.classes.uncheckedToIndeterminate
          : this.classes.uncheckedToChecked;
        break;
    }
    if (newClass) {
      this.sRenderer.updateClass(newClass, this._currentCheckStateClass);
      this._currentCheckStateClass = newClass;
      const animationClass = this._currentCheckStateClass;
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.sRenderer.removeClass(animationClass);
        }, 1000);
      });
    }
    this._currentCheckState = newState;
  }

  private _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

}
