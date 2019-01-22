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
  StaticProvider,
  Directive,
  Host,
  ViewChild,
  TemplateRef
  } from '@angular/core';
import {
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  SelectControlValueAccessor,
  ControlValueAccessor
  } from '@angular/forms';
import { LyField, LyFieldControlBase } from '@alyle/ui/field';
import { toBoolean, LyTheme2, LySelectionModel, LyOverlay, OverlayFromTemplateRef } from '@alyle/ui';
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
    '(click)': 'open()',
    'tabindex': '0'
  },
  providers: [
    SELECT_VALUE_ACCESSOR,
    { provide: LyFieldControlBase, useExisting: LySelect }
  ]
})
export class LySelect
    implements ControlValueAccessor, LyFieldControlBase, OnInit, DoCheck, OnDestroy {
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  _selectionModel: LySelectionModel<LyOption> = new LySelectionModel();
  private _value: any;
  private _menuRef: OverlayFromTemplateRef | null;
  protected _disabled = false;
  protected _required = false;
  protected _placeholder: string;
  readonly stateChanges: Subject<void> = new Subject<void>();
  private _hasDisabledClass?: boolean;
  private _errorClass?: string;
  private _form: NgForm | FormGroupDirective | null = this._parentForm || this._parentFormGroup;
  private _multiple: boolean;
  _focused: boolean = false;
  errorState: boolean = false;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  /**
   * The registered callback function called when a change event occurs on the input element.
   */
  onChange = (_: any) => {};

  /**
   * The registered callback function called when a blur event occurs on the input element.
   */
  onTouched = () => {};

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
      this.writeValue(val);
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
          this._renderer.removeClass(this._field._getHostElement(), this._field.classes.disabled);
          this._hasDisabledClass = undefined;
        } else if (val) {
          this._renderer.addClass(this._field._getHostElement(), this._field.classes.disabled);
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
  set multiple(value: boolean) {
    this._multiple = toBoolean(value);
  }
  get multiple(): boolean { return this._multiple; }

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
    return this.multiple ? this._selectionModel.isEmpty() : val == null || this._selectionModel.isEmpty();
  }

  constructor(private _theme: LyTheme2,
              private _renderer: Renderer2,
              private _el: ElementRef,
              private _overlay: LyOverlay,
              @Optional() private _field: LyField,
              /** @docs-private */
              @Optional() @Self() public ngControl: NgControl,
              @Optional() private _parentForm: NgForm,
              @Optional() private _parentFormGroup: FormGroupDirective) { }

  ngOnInit() {
    const ngControl = this.ngControl;
    // update styles on disabled
    if (ngControl && ngControl.statusChanges) {
      ngControl.statusChanges.subscribe(() => {
        this.disabled = !!ngControl.disabled;
      });
    }

    // apply class {selectArrow} to `<select>`
    this._renderer.addClass(this._field._getHostElement(), this._field.classes.selectArrow);

    // apply default styles
    this._renderer.addClass(this._el.nativeElement, this._field.classes.inputNative);
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
  }

  ngDoCheck() {
    const oldVal = this.errorState;
    const newVal = !!(this.ngControl && this.ngControl.invalid && (this.ngControl.touched || (this._form && this._form.submitted)));
    if (newVal !== oldVal) {
      this.errorState = newVal;
      if (this._field) {
        const errorClass = this._field.classes.errorState;
        if (newVal) {
          this._renderer.addClass(this._field._getHostElement(), errorClass);
          this._errorClass = errorClass;
        } else if (this._errorClass) {
          this._renderer.removeClass(this._field._getHostElement(), errorClass);
          this._errorClass = undefined;
        }
      }
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    if (this._menuRef) {
      this._menuRef.destroy();
    }
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

  /**
   * Sets the "value" property on the input element.
   *
   * @param value The checked value
   */
  writeValue(value: any): void {
    this.value = value;
    console.log({value});
  }

  /**
   * Registers a function called when the control value changes.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: (value: any) => any): void {
    this.onChange = (valueString: string) => {
      this.value = valueString;
      console.log({valueString});
      fn(this.value);
    };
  }

  /**
   * Registers a function called when the control is touched.
   *
   * @param fn The callback function
   */
  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  open() {
    this._menuRef = this._overlay.create(this.templateRef);
  }

}

@Directive({
  selector: 'ly-option'
})
export class LyOption {
  private _value: any;

  @HostListener('click') _onClick() {
    this._select._selectionModel.select(this);
    this._select.writeValue(this._value);
    // this._select.onChange(this._value);
    console.log('onclick', this._select._selectionModel, this._select.value);
  }

  /**
   * Tracks simple string values bound to the option element.
   */
  @Input('value')
  set value(value: any) {
    this._value = value;
  }


  constructor(/*private _element: ElementRef,
              private _renderer: Renderer2,*/
              @Optional() @Host() private _select: LySelect) { }

  _setElementValue() {}
}