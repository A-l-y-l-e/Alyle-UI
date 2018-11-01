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
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LyCoreStyles as LyCommonStyles, LyTheme2, LyCommon, toBoolean, ThemeVariables, LY_COMMON_STYLES } from '@alyle/ui';

const STYLE_PRIORITY = -2;

const STYLES = (theme: ThemeVariables) => ({
  root: { },
  layout: {
    display: 'inline-flex',
    alignItems: 'baseline'
  },
  icon: {
    position: 'relative',
    marginEnd: '8px',
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '18px',
    '&::before': {
      content: `''`,
      ...LY_COMMON_STYLES.fill,
      width: '18px',
      height: '18px',
      border: 'solid 2px',
      borderRadius: '2px',
      margin: 'auto',
    }
  },
  input: {
    ...LY_COMMON_STYLES.visuallyHidden
  },
  disabled: {
    '&{input}': {
      visibility: 'hidden'
    }
  },
  animations: { }
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
export class LyCheckbox implements ControlValueAccessor {
  /**
   * styles
   * @ignore
   */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  protected _required: boolean;
  protected _indeterminate: boolean;
  protected _checked: boolean;
  /** The value attribute of the native input element */
  @Input() value: string;

  /**
   * Whether the checkbox is checked.
   */
  @Input()
  get checked(): boolean { return this._checked; }
  set checked(val: boolean) {
    if (val !== this.checked) {
      this._checked = val;
    }
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(val: boolean) {
    this._required = toBoolean(val);
  }
  get disabled() {
    return this._common.disabled;
  }

  /** The native `<input type="checkbox">` element */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  constructor(
    public _commonStyles: LyCommonStyles,
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    private _common: LyCommon
  ) { }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle() {
    this.checked = !this.checked;
  }

  _onInputChange(event: Event) {
    event.stopPropagation();
  }
  _onInputClick(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.toggle();
      console.log(this._el, this.checked);
    }
  }

}
