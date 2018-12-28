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
import { LyCommonModule, LyTheme2, LyCoreStyles, toBoolean, mixinDisableRipple, ThemeVariables } from '@alyle/ui';

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

export const STYLES = (theme: ThemeVariables) => ({
  radioGroup: {
    display: 'inline-block'
  },
  radio: {
    display: 'inline-block',
    '&{checked}': {
      '{container}': {
        'div:nth-child(1)': {
          transform: 'scale(1.25)',
        },
        'div:nth-child(2)': {
          transform: 'scale(0.8)'
        }
      }
    }
  },
  label: {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'flex',
    alignItems: 'baseline'
  },
  labelContent: {
    padding: '0 0.5em'
  },
  container: {
    position: 'relative',
    marginRight: '8px',
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '16px',
    height: '16px',
    'div': {
      margin: 'auto',
      borderRadius: '50%',
      width: '1em',
      height: '1em'
    },
    'div:nth-child(2)': {
      background: 'currentColor',
      transform: 'scale(0)'
    },
    'div:nth-child(1)': {
      transform: 'scale(1)',
      border: 'solid .08em currentColor',
      color: theme.radio.outerCircle
    }
  },
  checked: null,
  _animations: {
    '{container} div': {
      transition: 'transform cubic-bezier(.1, 1, 0.5, 1)',
      transitionDuration: '250ms'
    }
  }
});

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
  readonly classes = this.theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _value = new UndefinedValue;
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
   * @param isDisabled Whether the control should be disabled.
   * @docs-private
   */
  setDisabledState(isDisabled: boolean) {
    // this.disabled = isDisabled;
    this._markForCheck();
  }

  constructor(
    elementRef: ElementRef,
    _renderer: Renderer2,
    public theme: LyTheme2,
    public ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    _renderer.addClass(elementRef.nativeElement, this.classes.radioGroup);
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
    if (!newChecked) {
      /** when val not exist in radio button !==  */
      this._controlValueAccessorChangeFn(null);
      if (this._value !== null) {
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
    this.cd.markForCheck();
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
  ]
})
export class LyRadio extends LyRadioMixinBase implements OnInit, AfterViewInit, OnDestroy {
  readonly classes = this.radioGroup.classes;
  id = `ly-radio-id-${idx++}`;
  name = '';
  private _value = null;
  private _checked = false;
  private _color: string;
  private _colorClass: string;
  private _animClass: string;
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
      this._colorClass = this._theme.addStyle(
        `lyRadio.color:${val}`,
        (theme: ThemeVariables) => ({
          '&{checked} {container}, &{checked} {container} div:nth-child(1), & {container} div:nth-child(2)': {
            color: theme.colorOf(val)
          }
        }),
        this._elementRef.nativeElement,
        this._colorClass,
        STYLE_PRIORITY,
        STYLES
      );
    }
  }
  get color() { return this._color; }

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

  constructor(
    @Optional() public radioGroup: LyRadioGroup,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    theme: LyTheme2,
    private changeDetectorRef: ChangeDetectorRef,
    ngZone: NgZone,
    public coreStyles: LyCoreStyles
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
    // this._elementRef.nativeElement.classList.add(this.classes._animations);
  }

  ngAfterViewInit() {
    this._rippleContainer = this._radioContainer;

    // set default disable ripple
    if (this.disableRipple == null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
    // this._renderer.addClass(this._elementRef.nativeElement, this.classes._animations);
    // setTimeout(() => {
    // }, 0);
    // Promise.resolve(null).then(() => {
    //   this._elementRef.nativeElement.classList.add(this.classes._animations);
    // });
    // this._ngZone.onMicrotaskEmpty.pipe(first()).subscribe(() => {
    //   const that = this;
    //   that._renderer.addClass(that._elementRef.nativeElement, that.classes._animations);
    //   // console.log(a, b, c);
    // });
    // this._elementRef.nativeElement.classList.add(this.classes._animations);
  }

  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
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
