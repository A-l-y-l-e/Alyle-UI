import {
  animate,
  keyframes,
  style,
  transition,
  trigger
  } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  Host,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  StaticProvider,
  TemplateRef,
  ViewChild
  } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  SelectControlValueAccessor
  } from '@angular/forms';
import { LyField, LyFieldControlBase } from '@alyle/ui/field';
import {
  LyOverlay,
  LySelectionModel,
  LyTheme2,
  OverlayFromTemplateRef,
  shadowBuilder,
  ThemeVariables,
  toBoolean
  } from '@alyle/ui';
import { Subject } from 'rxjs';

export const STYLES = (theme: ThemeVariables) => ({
  root: {
    display: 'block',
    paddingAfter: '1em',
    minWidth: '3em',
    cursor: 'pointer',
    height: '1.125em'
  },
  container: {
    background: theme.background.primary.default,
    borderRadius: '2px',
    boxShadow: shadowBuilder(4),
    display: 'block',
    paddingTop: '8px',
    paddingBottom: '8px',
    transformOrigin: 'inherit',
    pointerEvents: 'all',
    overflow: 'auto',
    maxHeight: 'inherit',
    maxWidth: 'inherit'
  }
});
const STYLE_PRIORITY = -2;

/** @docs-private */
const ANIMATIONS = [
  trigger('selectEnter', [
    transition('void => in', [
      animate('125ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
        style({
          opacity: 0,
          transform: 'scale(0.8)'
        }),
        style({
          opacity: 1,
          transform: 'scale(1)'
        })
      ]))
    ]),
  ]),
  trigger('selectLeave', [
    transition('* => void', animate('150ms linear', style({ opacity: 0 })))
  ])
];

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
  animations: [...ANIMATIONS],
  providers: [
    SELECT_VALUE_ACCESSOR,
    { provide: LyFieldControlBase, useExisting: LySelect }
  ]
})
export class LySelect
    implements ControlValueAccessor, LyFieldControlBase, OnInit, DoCheck, OnDestroy {
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  _selectionModel: LySelectionModel<LyOption>;
  private _value: any;
  private _overlayRef: OverlayFromTemplateRef | null;
  protected _disabled = false;
  protected _required = false;
  protected _placeholder: string;
  readonly stateChanges: Subject<void> = new Subject<void>();
  private _hasDisabledClass?: boolean;
  private _errorClass?: string;
  private _form: NgForm | FormGroupDirective | null = this._parentForm || this._parentFormGroup;
  private _multiple: boolean;
  private _opened: boolean;
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
    if (this._focused !== false && !this._opened) {
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

  endAnimation(e) {
    if (e.toState === 'void') {
      if (this._overlayRef) {
        this._overlayRef.remove();
        this._overlayRef = null;
      }
    }
  }

  /** @docs-private */
  @Input()
  set value(val) {
    if (val !== this.value) {
      this._value = val;
      this.writeValue(val);
      this.stateChanges.next();
      this._cd.markForCheck();
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

  get floatingLabel() {
    return this._opened ? true : !this.empty;
  }

  constructor(private _theme: LyTheme2,
              private _renderer: Renderer2,
              private _el: ElementRef,
              private _overlay: LyOverlay,
              @Optional() private _field: LyField,
              private _cd: ChangeDetectorRef,
              /** @docs-private */
              @Optional() @Self() public ngControl: NgControl,
              @Optional() private _parentForm: NgForm,
              @Optional() private _parentFormGroup: FormGroupDirective) { }

  ngOnInit() {
    this._selectionModel = new LySelectionModel({
      multiple: this.multiple ? true : undefined
    });
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
    if (this._overlayRef) {
      this._overlayRef.destroy();
    }
  }

  open() {
    this._opened = true;
    this.stateChanges.next();
    this._overlayRef = this._overlay.create(this.templateRef, null, {
      styles: {
        top: 0,
        left: 0,
        pointerEvents: null
      },
      fnDestroy: this.close.bind(this),
      backdrop: true
    });
    this._onFocus();
  }

  close() {
    if (this._overlayRef) {
      this.onTouched();
      this._overlayRef.detach();
      this._opened = false;
      this._getHostElement().focus();
      this.stateChanges.next();
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

}

@Directive({
  selector: 'ly-option'
})
export class LyOption {
  private _value: any;

  @HostListener('click') _onClick() {
    this._select._selectionModel.select(this);
    this._select.value = this._value;
    if (!this._select.multiple) {
      this._select.close();
    }
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

}
