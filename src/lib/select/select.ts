import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  StaticProvider
  } from '@angular/core';
import {
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  SelectControlValueAccessor
  } from '@angular/forms';
import { LyField, LyFieldControlBase } from '@alyle/ui/field';
import { toBoolean, LyTheme2 } from '@alyle/ui';
import { Subject } from 'rxjs';

export const STYLES = () => ({
  root: {
    display: 'block',
    paddingAfter: '1em',
    minWidth: '3em',
    cursor: 'pointer',
    height: '1.125em'
  }
});
const STYLE_PRIORITY = -2;

export const SELECT_VALUE_ACCESSOR: StaticProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlValueAccessor),
  multi: true
};

@Component({
  selector:
      'ly-select:not([multiple]),ly-select:not([multiple]),[formControlName],ly-select:not([multiple])[formControl],ly-select:not([multiple])[ngModel]',
  templateUrl: 'select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySelect',
  host: {
    '(change)': 'onChange($event.target.value)',
    'tabindex': '0'
  },
  providers: [
    SELECT_VALUE_ACCESSOR,
    { provide: LyFieldControlBase, useExisting: LySelect }
  ]
})
export class LySelect
    extends SelectControlValueAccessor
    implements LyFieldControlBase, OnInit, DoCheck, OnDestroy {
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _value: any;
  protected _disabled = false;
  protected _required = false;
  protected _placeholder: string;
  readonly stateChanges: Subject<void> = new Subject<void>();
  private _hasDisabledClass?: boolean;
  private _errorClass?: string;
  private _form: NgForm | FormGroupDirective | null = this._parentForm || this._parentFormGroup;
  _focused: boolean = false;
  errorState: boolean = false;

  @HostListener('blur') _onBlur() {
    this.onTouched();
    if (this._focused !== false) {
      this._focused = false;
      this.stateChanges.next();
    }
  }
  @HostListener('focus') _onFocus() {
    if (this._focused !== true) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  /** @docs-private */
  @Input()
  set value(val) {
    if (val !== this.value) {
      this._value = val;
      this.stateChanges.next();
    }
  }
  get value() {
    return this._value;
  }

  /** Whether the input is disabled. */
  @Input()
  set disabled(val: boolean) {
    if (val !== this._disabled) {
      this._disabled = toBoolean(val);
      if (this._field) {
        if (!val && this._hasDisabledClass) {
          this._renderer2.removeClass(this._field._getHostElement(), this._field.classes.disabled);
          this._hasDisabledClass = undefined;
        } else if (val) {
          this._renderer2.addClass(this._field._getHostElement(), this._field.classes.disabled);
          this._hasDisabledClass = true;
        }
      }
    }
  }
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  @Input()
  set required(value: boolean) {
    this._required = toBoolean(value);
  }
  get required(): boolean { return this._required; }

  @Input()
  set placeholder(val: string) {
    this._placeholder = val;
  }
  get placeholder(): string { return this._placeholder; }

  get focused() {
    return this._focused;
  }

  get empty() {
    const val = this.value;
    return val === '' || val === null || val === undefined;
  }

  constructor(private _theme: LyTheme2,
              private _renderer2: Renderer2,
              private _el: ElementRef,
              @Optional() private _field: LyField,
              /** @docs-private */
              @Optional() @Self() public ngControl: NgControl,
              @Optional() private _parentForm: NgForm,
              @Optional() private _parentFormGroup: FormGroupDirective) {
    super(_renderer2, _el);
  }

  ngOnInit() {
    const ngControl = this.ngControl;
    // update styles on disabled
    if (ngControl && ngControl.statusChanges) {
      ngControl.statusChanges.subscribe(() => {
        this.disabled = !!ngControl.disabled;
      });
    }

    // apply class {selectArrow} to `<select>`
    this._renderer2.addClass(this._field._getHostElement(), this._field.classes.selectArrow);

    // apply default styles
    this._renderer2.addClass(this._el.nativeElement, this._field.classes.inputNative);
    this._renderer2.addClass(this._el.nativeElement, this.classes.root);
  }

  ngDoCheck() {
    const oldVal = this.errorState;
    const newVal = !!(this.ngControl && this.ngControl.invalid && (this.ngControl.touched || (this._form && this._form.submitted)));
    if (newVal !== oldVal) {
      this.errorState = newVal;
      if (this._field) {
        const errorClass = this._field.classes.errorState;
        if (newVal) {
          this._renderer2.addClass(this._field._getHostElement(), errorClass);
          this._errorClass = errorClass;
        } else if (this._errorClass) {
          this._renderer2.removeClass(this._field._getHostElement(), errorClass);
          this._errorClass = undefined;
        }
      }
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  /** @docs-private */
  onContainerClick() {
    this._getHostElement().focus();
  }

  /** Focuses the input. */
  focus(): void { this._getHostElement().focus(); }

  _getHostElement() {
    return this._el.nativeElement;
  }
}
