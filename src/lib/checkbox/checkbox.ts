import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
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
  toBoolean,
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

const STYLE_PRIORITY = -2;
const DEFAULT_WITH_COLOR = 'accent';
const DEFAULT_DISABLE_RIPPLE = false;

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
      &${checkbox.disabled}:not(${checkbox.checked}) ${checkbox.icon}:before {
        color: ${theme.disabled.default}
      }
      &${checkbox.disabled} {
        pointer-events: none
        ${checkbox.layout} {
          color: ${theme.text.secondary}
        }
      }
      &${checkbox.disabled}${checkbox.checked} ${checkbox.icon}:before {
        border: 0
        background: ${theme.disabled.default}
      }
      &${checkbox.onFocusByKeyboard} ${checkbox.icon}::after {
        box-shadow: 0 0 0 12px
        opacity: .13
        border-radius: 50%
      }
      &:not(${checkbox.checked}) ${checkbox.icon} {
        color: ${theme.text.secondary}
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
    checked: ( ) => lyl `{
      & ${checkbox.icon}::before {
        background: currentColor
      }
      & ${checkbox.icon} polyline {
        stroke-dashoffset: 0
      }
    }`,
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
        transition: all ${theme.animations.durations.entering}ms ${theme.animations.curves.sharp}
      }
    }`
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
export class LyCheckbox extends LyCheckboxMixinBase implements WithStyles, ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  /** @ignore */
  static readonly и = 'LyCheckbox';
  /**
   * styles
   * @ignore
   */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  protected _color: string;
  protected _colorClass: string;
  protected _required: boolean;
  protected _indeterminate: boolean;
  protected _checked: boolean;
  protected _disabled;
  private _onFocusByKeyboardState: boolean;

  @ViewChild('innerContainer') _innerContainer: ElementRef<HTMLDivElement>;

  /** The value attribute of the native input element */
  @Input() value: string;

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
  set checked(val: boolean) {
    const newVal = toBoolean(val);
    // if (newVal !== this.checked) {
    this._checked = newVal;
    if (newVal) {
        this._renderer.addClass(this._el.nativeElement, this.classes.checked);
      } else {
        this._renderer.removeClass(this._el.nativeElement, this.classes.checked);
      }
    // }
    this._markForCheck();
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(val: boolean) {
    this._required = toBoolean(val);
  }
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: boolean) {
    const newVal = toBoolean(val);
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
  @Output() readonly change: EventEmitter<LyCheckboxChange> =
      new EventEmitter<LyCheckboxChange>();

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
    platform: Platform
  ) {
    super(_theme, ngZone, platform);
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
      this.color = DEFAULT_WITH_COLOR;
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
  }

  _onInputClick(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.toggle();
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

  private _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

}
