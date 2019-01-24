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
  TemplateRef,
  ViewChild,
  NgZone,
  OnChanges,
  QueryList
  } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm
  } from '@angular/forms';
import { LyField, LyFieldControlBase } from '@alyle/ui/field';
import {
  LyOverlay,
  LySelectionModel,
  LyTheme2,
  OverlayFromTemplateRef,
  shadowBuilder,
  ThemeVariables,
  toBoolean,
  Positioning,
  mixinStyleUpdater,
  mixinBg,
  mixinColor,
  mixinRaised,
  mixinDisabled,
  mixinOutlined,
  mixinElevation,
  mixinShadowColor,
  mixinDisableRipple,
  LyRippleService,
  XPosition,
  Dir
  } from '@alyle/ui';
import { Subject } from 'rxjs';
import { YPosition } from 'lib/src/position/position';
import { take } from 'rxjs/operators';

const DEFAULT_DISABLE_RIPPLE = false;
const STYLE_PRIORITY = -2;
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
    overflow: 'auto'
  },
  option: {
    display: 'flex',
    fontFamily: theme.typography.fontFamily,
    color: theme.text.default,
    '-webkit-tap-highlight-color': 'transparent',
    backgroundColor: `rgba(0, 0, 0, 0)`,
    border: 0,
    padding: '0 1em',
    margin: 0,
    outline: 'none',
    boxSizing: 'border-box',
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'pointer',
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    userSelect: 'none',
    lineHeight: '3em',
    height: '3em'
  },
  content: {
    padding: 0,
    display: 'flex',
    justifyContent: 'inherit',
    alignItems: 'inherit',
    alignContent: 'inherit',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  }
});

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
  /** @internal */
  @ViewChild(forwardRef(() => LyOption)) _options: QueryList<LyOption>;

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

  /** The value displayed in the trigger. */
  get triggerValue(): string {
    if (this._multiple) {
      const selectedOptions = this._selectionModel.selected.map(option => option.viewValue);

      if (this._theme.variables.direction === Dir.rtl) {
        selectedOptions.reverse();
      }

      return selectedOptions.join(', ');
    }

    return this._selectionModel.selected[0].viewValue;
  }

  constructor(private _theme: LyTheme2,
              private _renderer: Renderer2,
              private _el: ElementRef,
              private _overlay: LyOverlay,
              @Optional() private _field: LyField,
              private _cd: ChangeDetectorRef,
              private _ngZone: NgZone,
              /** @docs-private */
              @Optional() @Self() public ngControl: NgControl,
              @Optional() private _parentForm: NgForm,
              @Optional() private _parentFormGroup: FormGroupDirective) {
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

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
      onResizeScroll: this._updatePlacement.bind(this),
      backdrop: true
    });
    this._ngZone.onStable.pipe(
      take(1)
    ).subscribe(() => this._updatePlacement());
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
    this.onChange(this.value);
    console.log({value});
  }

  /**
   * Registers a function called when the control value changes.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: (value: any) => any): void {
    this.onChange = (valueString: string) => {
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

  private _updatePlacement() {
    const el = this._overlayRef!.containerElement as HTMLElement;
    const container = el.querySelector('div')!;

    // reset height & width
    this._renderer.setStyle(container, 'height', 'initial');
    this._renderer.setStyle(container, 'width', 'initial');

    const { nativeElement } = this._el;
    console.log(nativeElement.offsetHeight, this._options);


    const selectedElement: HTMLElement = this._selectionModel.isEmpty()
        ? el.querySelector('ly-option')!
        : this._selectionModel.selected[0]._getHostElement();

    const offset = {
      y: -(nativeElement.offsetHeight / 2 + selectedElement.offsetTop + selectedElement.offsetHeight / 2),
      x: -16
    };

    console.log(offset, selectedElement.offsetTop);

    const position = new Positioning(
      YPosition.below,
      XPosition.after,
      null as any,
      this._getHostElement(),
      el,
      this._theme.variables,
      offset,
      false
    );

    // set position
    this._renderer.setStyle(el, 'transform', `translate3d(${position.x}px, ${position.y}px, 0)`);
    this._renderer.setStyle(el, 'transform-origin', `${position.ox} ${position.oy} 0`);

    // set height & width
    this._renderer.setStyle(container, 'height', position.height);
    this._renderer.setStyle(container, 'width', position.width);
  }

}

/** @docs-private */
export class LyOptionBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

/** @docs-private */
export const LyOptionMixinBase = mixinStyleUpdater(
  mixinBg(
      mixinColor(
        mixinRaised(
          mixinDisabled(
            mixinOutlined(
              mixinElevation(
                mixinShadowColor(
                  mixinDisableRipple(LyOptionBase)))))))));

@Component({
  selector: 'ly-option',
  templateUrl: './option.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    'bg',
    'color',
    'raised',
    'disabled',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple'
  ]
})
export class LyOption extends LyOptionMixinBase implements OnInit, OnChanges {
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _value: any;

  @ViewChild('rippleContainer') _rippleContainer: ElementRef;

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

  /** The displayed value of the option. */
  get viewValue(): string {
    return ((this._getHostElement() as Element).textContent || '').trim();
  }

  constructor(@Host() private _select: LySelect,
              private _el: ElementRef,
              /** @internal */
              public _rippleService: LyRippleService,
              _renderer: Renderer2,
              _theme: LyTheme2,
              _ngZone: NgZone) {
    super(_theme, _ngZone);
    _renderer.addClass(_el.nativeElement, this.classes.option);
    this.setAutoContrast();
    this._triggerElement = _el;
  }

  ngOnInit() {
    if (this.disableRipple == null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  ngOnChanges() {
    this.updateStyle(this._el);
  }

  /** @internal */
  _getHostElement() {
    return this._el.nativeElement;
  }

}
