import {
  Component,
  Input,
  forwardRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  Renderer2,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  EventEmitter,
  Output,
  OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LyCoreStyles as LyCommonStyles, LyTheme2, LyCommon, toBoolean, ThemeVariables, LY_COMMON_STYLES, LyFocusState, Platform } from '@alyle/ui';

import { LyRippleService, Ripple } from '@alyle/ui/ripple';

const STYLE_PRIORITY = -2;
const DEFAULT_WITH_COLOR = 'primary';
const DEFAULT_DISABLE_RIPPLE = false;

const STYLES = (theme: ThemeVariables) => ({
  root: {
    '&{disabled}{checked} {icon}::before': {
      border: 0
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
    marginEnd: '8px',
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

@Component({
  selector: 'ly-checkbox',
  templateUrl: 'checkbox.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LY_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  exportAs: 'lyCheckbox'
})
export class LyCheckbox implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
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
  private _disableRipple: boolean;
  private _ripple: Ripple;
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

  /** Whether ripples are disabled. */
  @Input()
  get disableRipple(): boolean {
    return this._disableRipple;
  }
  set disableRipple(val: boolean) {
    if (Platform.isBrowser && val !== this._disableRipple) {
      const newVal = this._disableRipple = toBoolean(val);
      // remove previous ripple if exist
      this._destroyRipple();
      if (!newVal) {
        // add ripple
        const rippleContainer = this._innerContainer.nativeElement;
        const triggerElement = this._el.nativeElement;
        this._ripple = new Ripple(this._theme.config, this._ngZone, this._rippleService.classes, rippleContainer, triggerElement);
        this._ripple.setConfig({
          centered: true,
          radius: 'containerSize',
          percentageToIncrease: 150
        });
      }
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
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusState: LyFocusState,
    private _ngZone: NgZone,
    private _rippleService: LyRippleService
  ) { }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
    // set default
    if (!this.withColor) {
      this.withColor = DEFAULT_WITH_COLOR;
    }
  }

  ngAfterViewInit() {
    this._focusState.listen(this._inputElement, this._el).subscribe((event) => {
      // console.log(event.by, event.event.type);
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
    // set default ripple
    if (this.disableRipple === void 0) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
    this._renderer.addClass(this._el.nativeElement, this.classes.animations);
  }

  private _destroyRipple() {
    if (Platform.isBrowser) {
      if (this._ripple) {
        this._ripple.removeEvents();
        this._ripple = null;
      }
    }
  }

  ngOnDestroy() {
    this._focusState.unlisten(this._el);
    this._destroyRipple();
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

  _onInputChange(event: Event) {
    // event.stopPropagation();
  }

  _onInputClick(event: Event) {
    // event.stopPropagation();
    if (!this.disabled) {
      this.toggle();
      this._emitChangeEvent();
    }
    this._markForCheck();
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
