import {
  Component,
  forwardRef,
  NgModule,
  Input,
  Output,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ContentChildren,
  QueryList,
  Optional,
  EventEmitter,
  ChangeDetectionStrategy,
  NgZone,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  LyCommonModule,
  LyTheme2,
  LyCoreStyles,
  toBoolean,
  mixinDisableRipple,
  ThemeVariables,
  LyFocusState,
  LY_COMMON_STYLES,
  lyl, StyleCollection,
  LyClasses,
  StyleTemplate,
  ThemeRef,
  LyHostClass,
  StyleRenderer} from '@alyle/ui';

export interface LyRadioTheme {
  /** Styles for Radio Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyRadioVariables {
  radio?: LyRadioTheme;
}

const STYLE_PRIORITY = -2;
const DEFAULT_DISABLE_RIPPLE = false;
const DEFAULT_COLOR = 'accent';

export const LY_RADIO_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyRadioGroup),
  multi: true
};

let idx = 0;

export class UndefinedValue {
  constructor() { }
}

export const STYLES = (theme: ThemeVariables & LyRadioVariables, ref: ThemeRef) => {
  const radio = ref.selectorsOf(STYLES);
  const { after, before } = theme;
  return {
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      display: inline-block
      {
        ...${
          (theme.radio
            && theme.radio.root
            && (theme.radio.root instanceof StyleCollection
              ? theme.radio.root.setTransformer(fn => fn(radio))
              : theme.radio.root(radio))
          )
        }
      }
    }`,
    radio: ( ) => lyl `{
      display: inline-block
      margin-${after}: 16px
      margin-${before}: -16px
      &${radio.checked} {
        ${radio.container} {
          div:nth-child(1) {
            transform: scale(1.25)
          }
          div:nth-child(2) {
            transform: scale(0.8)
          }
        }
      }
      &${radio.onFocusByKeyboard} ${radio.container}::after {
        box-shadow: 0 0 0 12px
        background: currentColor
        opacity: .13
        border-radius: 50%
      }
    }`,
    label: lyl `{
      margin-${before}: 16px
      cursor: pointer
      white-space: nowrap
      position: relative
      display: flex
      align-items: baseline
      padding-top: 12px
      padding-bottom: 12px
    }`,
    labelContent: null,
    container: lyl `{
      position: relative
      margin-${before}: .125em
      margin-${after}: .5em
      margin-top: auto
      margin-bottom: auto
      width: 16px
      height: 16px
      div {
        margin: auto
        border-radius: 50%
        width: 1em
        height: 1em
        box-sizing: border-box
      }
      &::after {
        content: ''
        ...${LY_COMMON_STYLES.fill}
        width: 16px
        height: 16px
        margin: auto
      }
      div:nth-child(2) {
        background: currentColor
        transform: scale(0)
      }
      div:nth-child(1) {
        transform: scale(1)
        border: solid .08em currentColor
        color: ${theme.text.disabled}
      }
    }`,
    checked: null,
    _animations: ( ) => lyl `{
      ${radio.container} div {
        transition: transform cubic-bezier(.1, 1, 0.5, 1)
        transition-duration: 250ms
      }
    }`,
    onFocusByKeyboard: null,
    disabled: ( ) => lyl `{
      color: ${theme.disabled.contrast}
      ${radio.container} div {
        color: ${theme.disabled.contrast}!important
      }
    }`
  };
};

@Component({
  selector: 'ly-radio-group',
  template: `<ng-content></ng-content>`,
  providers: [LY_RADIO_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'lyRadioGroup'
})
export class LyRadioGroup implements ControlValueAccessor {
  /** @docs-private */
  static readonly и = 'LyRadioGroup';
  /** @docs-private */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  private _value: any;
  /** @docs-private */
  name = `ly-radio-name-${idx++}`;

  @Input()
  set value(val: any) {
    if (this._value !== val) {
      if (this._radios) {
        this._updateCheckFromValue(val);
      }
    }
  }
  get value() {
    return this._value;
  }

  @Output() readonly change: EventEmitter<void> = new EventEmitter<void>();

  @Input() color = 'accent';
  @ContentChildren(forwardRef(() => LyRadio)) _radios: QueryList<LyRadio>;

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   * @docs-private
   */
  onTouched: () => any = () => {};

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  /** @docs-private */
  writeValue(value: any) {
    if (!!this._radios) {
      this.value = value;
      this._markForCheck();
    }
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   * @docs-private
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   * @docs-private
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param _isDisabled Whether the control should be disabled.
   * @docs-private
   */
  setDisabledState(_isDisabled: boolean) {
    // this.disabled = isDisabled;
    this._markForCheck();
  }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private _theme: LyTheme2,
    private _cd: ChangeDetectorRef
  ) {
    renderer.addClass(elementRef.nativeElement, this.classes.root);
  }

  _updateCheckFromValue(val: any) {
    let newChecked: boolean;
    this._radios.forEach(radioButton => {
      if (val === radioButton.value) {
        this.updatevalue(val);
        newChecked = true;
        radioButton.checked = true;
      } else if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
    if (!newChecked!) {
      /** when val not exist in radio button !==  */
      this._controlValueAccessorChangeFn(null);
      if (this._value != null) {
        this._value = null;
      }
    }
  }
  /** @docs-private */
  updatevalue(value: any) {
    this._value = value;
    this._controlValueAccessorChangeFn(value);
    this.change.emit();
    this._markForCheck();
  }

  _markForCheck() {
    this._cd.markForCheck();
  }

  _radioResetChecked() {
    this._radios.forEach(_ => _._setCheckedToFalsy());
  }

}

/** @docs-private */
export class LyRadioBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

/** @docs-private */
export const LyRadioMixinBase = mixinDisableRipple(LyRadioBase);

@Component({
  selector: 'ly-radio',
  templateUrl: 'radio.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  inputs: [
    'disableRipple'
  ],
  providers: [
    LyHostClass,
    StyleRenderer
  ]
})
export class LyRadio extends LyRadioMixinBase implements OnInit, AfterViewInit, OnDestroy {
  /** @docs-private */
  static readonly и = 'LyRadio';
  /** @docs-private */
  readonly classes = this.radioGroup.classes;
  /** @docs-private */
  id = `ly-radio-id-${idx++}`;
  /** @docs-private */
  name = '';
  private _value = null;
  private _checked = false;
  private _color: string;
  private _animClass: string;
  private _disabled: boolean;
  private _disabledClass?: string;
  @ViewChild('_input') _input: ElementRef;
  @ViewChild('_radioContainer') private _radioContainer: ElementRef;
  @ViewChild('_labelContainer') _labelContainer: ElementRef;
  @Output() change = new EventEmitter<boolean>();

  @Input()
  set value(val) {
    if (this._value !== val) {
      this._value = val;
    }
  }
  get value() { return this._value; }

  @Input()
  set color(val) {
    if (this._color !== val) {
      this._color = val;
      this[0x1] = this._styleRenderer.add(
        `${LyRadio.и}--color-${val}`,
        (theme: ThemeVariables, ref) => {
          const {
            checked,
            container
          } = ref.selectorsOf(STYLES);
          return lyl `{
            &${checked} ${container}, &${checked} ${container} div:nth-child(1), & ${container} div:nth-child(2) {
              color: ${theme.colorOf(val)}
            }
          }`;
        },
        STYLE_PRIORITY,
        this[0x1]
      );
    }
  }
  get color() { return this._color; }
  [0x1]: string;

  @Input()
  set checked(val: boolean) {
    const newCheckedState = toBoolean(val);
    const before = this._checked;
    if (before !== newCheckedState) {
      this._checked = newCheckedState;
      if (!before && newCheckedState) {
        /** Add class checked */
        this._renderer.addClass(this._elementRef.nativeElement, this.classes.checked);

        if (this.value !== this.radioGroup.value) {
          /** update Value */
          this.radioGroup.updatevalue(this.value);
        }
      } else {
        /** Remove class checked */
        this._renderer.removeClass(this._elementRef.nativeElement, this.classes.checked);
      }
      this._markForCheck();
    }
  }

  get checked() {
    return this._checked;
  }

  /** @docs-private */
  get inputId(): string {
    return `${this.id}-input`;
  }

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value) {
    const newVal = toBoolean(value);
    if (newVal) {
      this._renderer.addClass(this._elementRef.nativeElement, this.classes.disabled);
      this._disabledClass = this.classes.disabled;
    } else if (this._disabledClass) {
      this._renderer.removeClass(this._elementRef.nativeElement, this.classes.disabled);
      this._disabledClass = undefined;
    }
    this._disabled = toBoolean(value);
    this._markForCheck();
  }

  constructor(
    /** @docs-private */
    @Optional() public radioGroup: LyRadioGroup,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    theme: LyTheme2,
    private changeDetectorRef: ChangeDetectorRef,
    ngZone: NgZone,
    public _coreStyles: LyCoreStyles,
    private _focusState: LyFocusState,
    private _styleRenderer: StyleRenderer
  ) {
    super(theme, ngZone);
    this._triggerElement = this._elementRef;
    this._rippleConfig = {
      centered: true,
      radius: 'containerSize',
      percentageToIncrease: 150
    };
    _renderer.addClass(_elementRef.nativeElement, radioGroup.classes.radio);
  }

  ngOnInit() {
    if (this.radioGroup) {
      // Copy name from parent radio group
      this.name = this.radioGroup.name;
    }
    if (!this.color) {
      this.color = this.radioGroup.color || DEFAULT_COLOR;
    }
  }

  ngAfterViewInit() {
    this._rippleContainer = this._radioContainer;

    // set default disable ripple
    if (this.disableRipple == null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
    const focusState = this._focusState.listen(this._input, this._elementRef);
    if (focusState) {
      focusState.subscribe((event) => {
        if (event === 'keyboard') {
          this._renderer.addClass(this._elementRef.nativeElement, this.classes.onFocusByKeyboard);
        } else if (event == null) {
          this._renderer.removeClass(this._elementRef.nativeElement, this.classes.onFocusByKeyboard);
        }
      });
    }
  }

  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this._focusState.unlisten(this._elementRef);
    this._removeRippleEvents();
  }

  _onInputChange(event: any) {
    event.stopPropagation();
    this.radioGroup._updateCheckFromValue(this.value);
    this.radioGroup._touch();
    this._addAnim();
  }

  private _addAnim() {
    if (!this._animClass) {
      this._renderer.addClass(this._elementRef.nativeElement, this.classes._animations);
      this._animClass = this.classes._animations;
    }
  }

  _onInputClick(event: Event) { event.stopPropagation(); }

  _setCheckedToFalsy() {
    this.checked = false;
  }

}

@NgModule({
  imports: [CommonModule, FormsModule, LyCommonModule],
  exports: [LyRadioGroup, LyRadio],
  declarations: [LyRadioGroup, LyRadio],
})
export class LyRadioModule { }
