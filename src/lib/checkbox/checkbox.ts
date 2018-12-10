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
  LY_COMMON_STYLES,
  LyCoreStyles as LyCommonStyles,
  LyFocusState,
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisableRipple,
  mixinElevation,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables,
  toBoolean
  } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_WITH_COLOR = 'accent';
const DEFAULT_DISABLE_RIPPLE = false;

const STYLES = (theme: ThemeVariables) => ({
  root: {
    '&{disabled}:not({checked}) {icon}:before': {
      color: theme.disabled.default
    },
    '&{disabled}': {
      pointerEvents: 'none',
      '{layout}': {
        color: theme.disabled.contrast
      }
    },
    '&{disabled}{checked} {icon}:before': {
      border: 0,
      background: theme.disabled.default
    },
    '&{onFocusByKeyboard} {icon}::after': {
      boxShadow: '0 0 0 12px',
      opacity: .13,
      borderRadius: '50%'
    },
    '&:not({checked}) {icon}': {
      ...theme.checkbox.unchecked
    }
  },
  layout: {
    display: 'inline-flex',
    alignItems: 'baseline',
    cursor: 'pointer'
  },
  icon: {
    position: 'relative',
    marginAfter: '8px',
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '16px',
    height: '16px',
    userSelect: 'none',
    ...theme.checkbox.root,
    '&::before, &::after': {
      content: `''`,
      ...LY_COMMON_STYLES.fill,
      width: '16px',
      height: '16px',
      margin: 'auto'
    },
    // border icon
    '&::before': {
      border: 'solid 2px',
      borderRadius: '2px'
    },
    svg: {
      position: 'absolute',
      polyline: {
        fill: 'none',
        stroke: theme.background.primary.default,
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: '18px',
        strokeDashoffset: '18px'
      }
    },
  },
  checked: {
    '& {icon}::before': {
      background: 'currentColor'
    },
    '& {icon} polyline': {
      strokeDashoffset: 0
    }
  },
  input: {
    ...LY_COMMON_STYLES.visuallyHidden
  },
  onFocusByKeyboard: { },
  disabled: {
    '& {input}': {
      visibility: 'hidden'
    },
    '& {icon}': {
      color: 'inherit !important'
    }
  },
  animations: {
    '& {icon} svg polyline': {
      transition: `all ${theme.animations.durations.entering}ms ${theme.animations.curves.sharp}`
    }
  }
});

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
    public _ngZone: NgZone
  ) { }
}

/** @docs-private */
export const LyCheckboxMixinBase = mixinStyleUpdater(
mixinBg(
  mixinColor(
    mixinRaised(
      mixinOutlined(
        mixinElevation(
          mixinShadowColor(
            mixinDisableRipple(LyCheckboxBase))))))));

@Component({
  selector: 'ly-checkbox',
  templateUrl: 'checkbox.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LY_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  exportAs: 'lyCheckbox',
  inputs: [
    'bg',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple'
  ]
})
export class LyCheckbox extends LyCheckboxMixinBase implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  /**
   * styles
   * @ignore
   */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  protected _withColor: string;
  protected _withColorClass: string;
  protected _required: boolean;
  protected _indeterminate: boolean;
  protected _checked: boolean;
  protected _disabled;
  private _onFocusByKeyboardState: boolean;
  @ViewChild('innerContainer') _innerContainer: ElementRef<HTMLDivElement>;
  /** The value attribute of the native input element */
  @Input() value: string;

  @Input()
  get withColor(): string {
    return this._withColor;
  }
  set withColor(val: string) {
    if (val !== this.withColor) {
      this._withColor = val;
      this._withColorClass = this._theme.addStyle(`lyCheckbox.withColor:${val}`, (theme: ThemeVariables) => ({
        [`&.${this.classes.checked} .${this.classes.icon}`]: {
          color: theme.colorOf(val)
        }
      }), this._el.nativeElement, this._withColorClass, STYLE_PRIORITY);
    }
  }

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
    ngZone: NgZone
  ) {
    super(_theme, ngZone);
    this._triggerElement = this._el;
    this._rippleConfig = {
      centered: true,
      radius: 'containerSize',
      percentageToIncrease: 150
    };
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
    // set default
    if (!this.withColor) {
      this.withColor = DEFAULT_WITH_COLOR;
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
        if (event.by === 'keyboard') {
          if (event.event.type === 'focus') {
            this._onFocusByKeyboardState = true;
            this._renderer.addClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
          }
        }
        this._onTouched();
      });
    }

    this._rippleContainer = this._innerContainer;

    // set default disable ripple
    if (this.disableRipple === null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
    this._renderer.addClass(this._el.nativeElement, this.classes.animations);
  }

  ngOnDestroy() {
    this._focusState.unlisten(this._el);
    this._removeRippleEvents();
  }
  writeValue(value: any): void {
    this.checked = !!value;
  }
  registerOnChange(fn: (value: any) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

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
