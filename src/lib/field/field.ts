import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  NgZone,
  Directive,
  OnDestroy,
  HostListener,
  HostBinding,
  Optional,
  Self,
  forwardRef,
  DoCheck
  } from '@angular/core';
import {
  LyTheme2,
  ThemeVariables,
  ElementObserver,
  Platform,
  toBoolean,
  DirAlias,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  LyHostClass,
  StyleRenderer,
  lyl,
  ThemeRef,
  LY_COMMON_STYLES } from '@alyle/ui';
import { LyLabel } from './label';
import { LyPlaceholder } from './placeholder';
import { LyHint } from './hint';
import { LyPrefix } from './prefix';
import { LySuffix } from './suffix';
import { Subject } from 'rxjs';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { LyError } from './error';
import { LyFieldControlBase } from './field-control-base';

export interface LyFieldTheme {
  /** Styles for Field Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  appearance?: {
    standard?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
      | ((classes: LyClasses<typeof STYLES>) => StyleTemplate)
    filled?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
      | ((classes: LyClasses<typeof STYLES>) => StyleTemplate)
    outlined?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
      | ((classes: LyClasses<typeof STYLES>) => StyleTemplate)
    [name: string]: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
      | ((classes: LyClasses<typeof STYLES>) => StyleTemplate) | undefined
  };
}

export interface LyFieldVariables {
  field?: LyFieldTheme;
}

/** LyField */
const STYLE_PRIORITY = -2;
const DEFAULT_APPEARANCE = 'standard';
const DEFAULT_WITH_COLOR = 'primary';

const inputText = [
  'text',
  'number',
  'password',
  'search',
  'tel',
  'url'
];


export const STYLE_SELECT_ARROW = lyl `{
  &::after {
    position: absolute
    content: ''
    width: 0
    height: 0
    border-left: 0.3125em solid transparent
    border-right: 0.3125em solid transparent
    border-top: 0.3125em solid
    top: 50%
    {after}: 0
    margin-top: -0.15625em
    pointer-events: none
  }
}`;

export const STYLES = (theme: ThemeVariables & LyFieldVariables, ref: ThemeRef) => {
  const classes = ref.selectorsOf(STYLES);
  const {before, after } = theme;
  return {
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      display: inline-block
      position: relative
      margin-top: 1em
      line-height: 1.5
      & ${classes.hint}, & ${classes.error} {
        display: block
        font-size: .75em
        margin-top: .25em
      }
      {
        ...${
          (theme.field
            && theme.field.root
            && (theme.field.root instanceof StyleCollection
              ? theme.field.root.setTransformer(fn => fn(classes))
              : theme.field.root(classes))
          )
        }
      }
    }`,
    animations: ( ) => lyl `{
      & ${classes.labelSpan} {
        transition: font-size ${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s
      }
      & ${classes.label} {
        transition: ${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s
      }
    }`,
    container: lyl `{
      height: 100%
      display: flex
      align-items: center
      position: relative
      -webkit-tap-highlight-color: transparent
      &:after {
        ...${LY_COMMON_STYLES.fill}
        content: ''
        pointer-events: none
      }
    }`,
    fieldset: lyl `{
      ...${LY_COMMON_STYLES.fill}
      margin: 0
      border-style: solid
      border-width: 0
    }`,
    fieldsetSpan: lyl `{
      padding: 0
      height: 2px
    }`,
    labelSpan: lyl `{
      max-width: 100%
      display: inline-block
    }`,
    prefix: lyl `{
      max-height: 2em
      display: flex
      align-items: center
    }`,
    infix: lyl `{
      display: inline-flex
      position: relative
      align-items: baseline
      min-width: 0
      width: 180px
      flex: 1 0
    }`,
    suffix: lyl `{
      max-height: 2em
      display: flex
      align-items: center
    }`,
    labelContainer: lyl `{
      ...${LY_COMMON_STYLES.fill}
      pointer-events: none
      display: flex
      width: 100%
    }`,
    labelSpacingStart: null,
    labelCenter: lyl `{
      display: flex
      max-width: 100%
    }`,
    labelSpacingEnd: lyl `{
      flex: 1
    }`,
    label: lyl `{
      ...${LY_COMMON_STYLES.fill}
      margin: 0
      border: none
      pointer-events: none
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
      width: 100%
    }`,
    isFloatingLabel: null,
    floatingLabel: ( ) => lyl `{
      ${classes.labelSpan} {
        font-size: 75%
      }
    }`,
    placeholder: lyl `{
      ...${LY_COMMON_STYLES.fill}
      pointer-events: none
    }`,
    focused: null,
    inputNative: lyl `{
      resize: vertical
      padding: 0
      outline: none
      border: none
      background-color: transparent
      color: inherit
      font: inherit
      width: 100%
      select& {
        -moz-appearance: none
        -webkit-appearance: none
        position: relative
        background-color: transparent
        display: inline-flex
        box-sizing: border-box
        padding-after: 1em
        option:not([disabled]) {
          color: initial
        }
        optgroup:not([disabled]) {
          color: initial
        }
      }
      select&::-ms-expand {
        display: none
      }
      select&::-moz-focus-inner {
        border: 0
      }
      select&:not(:disabled) {
        cursor: pointer
      }
      select&::-ms-value {
        color: inherit
        background: 0 0
      }
    }`,
    hintContainer: lyl `{
      min-height: 1.25em
      line-height: 1.25
      > div {
        display: flex
        flex: 1 0 auto
        max-width: 100%
        overflow: hidden
        justify-content: space-between
      }
    }`,
    disabled: ( ) => lyl `{
      &, & ${classes.label}, & ${classes.container}:after {
        color: ${theme.disabled.default}
        cursor: default
      }
    }`,
    hint: null,
    error: null,
    errorState: ( ) => lyl `{
      & ${classes.label}, & ${classes.hintContainer}, &${classes.selectArrow} ${classes.infix}:after {
        color: ${theme.warn.default}!important
      }
      & ${classes.fieldset}, & ${classes.container}:after {
        border-color: ${theme.warn.default}!important
      }
      & ${classes.inputNative} {
        caret-color: ${theme.warn.default}!important
      }
      & ${classes.hintContainer} ly-hint:not(${classes.hintAfter}) {
        display: none
      }
      & ${classes.labelSpan} {
        animation: {shake} ${theme.animations.durations.complex}ms ${theme.animations.curves.deceleration}
      }
      & ${classes.inputNative}::selection, & ${classes.inputNative}::-moz-selection {
          background-color: ${theme.warn.default} !important
          color: ${theme.warn.contrast} !important
      }
    }`,
    hintAfter: lyl `{
      margin-${before}: auto
    }`,
    hintBefore: lyl `{
      margin-${after}: auto
    }`,
    selectArrow: ( ) => lyl `{
      ${classes.infix} {
        &::after {
          position: absolute
          content: ''
          width: 0
          height: 0
          border-left: 0.3125em solid transparent
          border-right: 0.3125em solid transparent
          border-top: 0.3125em solid
          top: 50%
          ${after}: 0
          margin-top: -0.15625em
          pointer-events: none
        }
      }
    }`,
    $keyframes: {
      shake: {
        0: {
          marginBefore: 0
        },
        40: {
          marginBefore: '2px'
        },
        50: {
          marginBefore: '-2px'
        },
        70: {
          marginBefore: '2px'
        },
        100: {
          marginBefore: 0
        },
      }
    }
  };
};


@Component({
  selector: 'ly-field',
  exportAs: 'lyFormField',
  templateUrl: 'field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    LyHostClass,
    StyleRenderer,
  ]
})
export class LyField implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  /**
   * styles
   * @docs-private
   */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  protected _appearance: string;
  protected _appearanceClass: string;
  protected _color: string;
  protected _colorClass: string;
  protected _isFloating: boolean;
  protected _floatingLabel: boolean;
  private _fielsetSpanClass: string;
  private _marginStartClass: string;
  private _marginEndClass: string;
  private _fullWidth: boolean;
  private _fullWidthClass?: string;
  @ViewChild('_labelContainer', { static: false }) _labelContainer: ElementRef<HTMLDivElement>;
  @ViewChild('_labelContainer2', { static: false }) _labelContainer2: ElementRef<HTMLDivElement>;
  @ViewChild('_labelSpan', { static: false }) _labelSpan: ElementRef<HTMLDivElement>;
  @ViewChild('_prefixContainer', { static: false }) _prefixContainer: ElementRef<HTMLDivElement>;
  @ViewChild('_suffixContainer', { static: false }) _suffixContainer: ElementRef<HTMLDivElement>;
  @ViewChild('_fieldsetLegend', { static: false }) _fieldsetLegend: ElementRef<HTMLDivElement>;
  @ContentChild(forwardRef(() => LyFieldControlBase), { static: false }) _control?: LyFieldControlBase;
  @ContentChild(LyPlaceholder, { static: false }) _placeholderChild: LyPlaceholder;
  @ContentChild(LyLabel, { static: false }) _labelChild: LyLabel;
  @ContentChildren(LyHint) _hintChildren: QueryList<LyHint>;
  @ContentChildren(LyPrefix) _prefixChildren: QueryList<LyPrefix>;
  @ContentChildren(LySuffix) _suffixChildren: QueryList<LySuffix>;
  @ContentChildren(LyError) _errorChildren: QueryList<LyError>;

  get errorState() {
    return this._control ? this._control.errorState : false;
  }

  @Input() persistentHint: boolean;

  @Input()
  set fullWidth(val: boolean) {
    const newVal = toBoolean(val);
    if (newVal) {
      this._fullWidthClass = this._theme.addStyle(
        `fullWidth`,
        {
          display: 'block',
          width: '100%'
        },
        this._getHostElement(),
        this._fullWidthClass,
        STYLE_PRIORITY
      );
    } else if (this._fullWidthClass) {
      this._renderer.removeClass(this._getHostElement(), this._fullWidthClass);
      this._fullWidthClass = undefined;
    }
    this._fullWidth = newVal;
  }
  get fullWidth() {
    return this._fullWidth;
  }

  /** Whether the label is floating. */
  @Input()
  set floatingLabel(val: boolean) {
    this._floatingLabel = toBoolean(val);
    this._updateFloatingLabel();
  }
  get floatingLabel() {
    return this._floatingLabel;
  }

  /** Theme color for the component. */
  @Input()
  set color(val: string) {
    if (val !== this._color) {
      this._color = val;
      this._colorClass = this._theme.addStyle(`ly-field.color:${val}`, (theme: ThemeVariables) => {
        const color = theme.colorOf(val);
        const contrast = theme.colorOf(`${val}:contrast`);
        return {
          [`&.${this.classes.focused} .${this.classes.container}:after, &{focused}{selectArrow} {infix}:after`]: {
            color
          },
          [`&.${this.classes.focused} .${this.classes.fieldset}`]: {
            borderColor: color
          },
          [`&.${this.classes.focused} .${this.classes.label}`]: {
            color
          },
          [`& .${this.classes.inputNative}`]: {
            caretColor: color
          },
          '& {inputNative}::selection': {
            backgroundColor: color,
            color: contrast
          },
          '& {inputNative}::-moz-selection': {
            backgroundColor: color,
            color: contrast
          }
        };
      }, this._el.nativeElement, this._colorClass, STYLE_PRIORITY + 1, STYLES);
    }
  }
  get color() {
    return this._color;
  }

  /** The field appearance style. */
  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      this[0x1] = this._styleRenderer.add(
        `ly-field.appearance:${val}`,
        (theme: ThemeVariables & LyFieldVariables, ref) => {
          const classes = ref.selectorsOf(STYLES);
          if (theme.field && theme.field.appearance) {
            const appearance = theme.field.appearance[val];
            if (appearance) {
              return appearance instanceof StyleCollection
                ? appearance.call.bind(appearance.setTransformer((_) => _(classes)))
                : appearance(classes);
            }
          }
          throw new Error(`${val} not found in theme.field.appearance`);
      }, STYLE_PRIORITY, this[0x1]);
    }
  }
  get appearance() {
    return this._appearance;
  }

  [0x1]: string;

  @HostListener('focus') onFocus() {
    this._el.nativeElement.focus();
  }

  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _elementObserver: ElementObserver,
    private _theme: LyTheme2,
    private _cd: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _styleRenderer: StyleRenderer
  ) {
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if (!this.color) {
      this.color = DEFAULT_WITH_COLOR;
    }
    if (!this.appearance) {
      this.appearance = DEFAULT_APPEARANCE;
    }
  }

  ngAfterContentInit() {
    this._control!.stateChanges.subscribe(() => {
      this._updateFloatingLabel();
      this._markForCheck();
    });

    const ngControl = this._control!.ngControl;

    // Run change detection if the value changes.
    if (ngControl && ngControl.valueChanges) {
      ngControl.valueChanges.subscribe(() => {
        this._updateFloatingLabel();
        this._markForCheck();
      });
    }
  }

  ngAfterViewInit() {
    this._updateFloatingLabel();
    if (Platform.isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        if (this._prefixContainer) {
          const el = this._prefixContainer.nativeElement;
          this._updateFielset(el, DirAlias.before);
          this._elementObserver.observe(el, () => {
            this._updateFielset(el, DirAlias.before);
          });
        }
        if (this._suffixContainer) {
          const el = this._suffixContainer.nativeElement;
          this._updateFielset(el, DirAlias.after);
          this._elementObserver.observe(el, () => {
            this._updateFielset(el, DirAlias.after);
          });
        }
        if (this._labelSpan) {
          const el = this._labelSpan.nativeElement;
          this._updateFielsetSpan();
          this._elementObserver.observe(el, () => {
            this._updateFielsetSpan();
          });
        }
      });
    }
    // this fix with of label
    this._renderer.addClass(this._el.nativeElement, this.classes.animations);
  }

  ngOnDestroy() {
    if (this._prefixContainer) {
      const el = this._prefixContainer;
      this._elementObserver.destroy(el);
    }
    if (this._suffixContainer) {
      const el = this._suffixContainer;
      this._elementObserver.destroy(el);
    }
    if (this._labelSpan) {
      const el = this._labelSpan;
      this._elementObserver.destroy(el);
    }
  }

  private _updateFielset(el: Element, dir: DirAlias) {
    const { width } = el.getBoundingClientRect();
    const newClass = this._theme.addStyle(`fieldLegendstyle.margin${dir}:${width}`, () => ({
      [`& .${this.classes.fieldsetSpan}`]: {
        [`margin-${dir}`]: `${width}px`
      }
    }), undefined, undefined, STYLE_PRIORITY);
    if (dir === DirAlias.before) {
      this._marginStartClass = this._theme.updateClass(this._el.nativeElement, this._renderer, newClass, this._marginStartClass);
    } else {
      this._marginEndClass = this._theme.updateClass(this._el.nativeElement, this._renderer, newClass, this._marginEndClass);
    }
  }

  private _updateFielsetSpan() {
    let { width } = this._labelSpan.nativeElement.getBoundingClientRect();
    if (!this._isFloating) {
      width -= width / 100 * 25;
    }
    /** Add 6px of spacing */
    width += 6;
    this._fielsetSpanClass = this._theme.addStyle(`style.fieldsetSpanFocused:${width}`, {
      [`&.${this.classes.isFloatingLabel} .${this.classes.fieldsetSpan}`]: {width: `${width}px`}
    }, this._el.nativeElement, this._fielsetSpanClass, STYLE_PRIORITY);
  }
  /** @ignore */
  _isLabel() {
    if (this._control && this._control.placeholder && !this._labelChild) {
      return true;
    } else if (this._labelChild || this._placeholderChild) {
      return true;
    }
    return false;
  }

  /** @ignore */
  _isPlaceholder() {
    if ((this._labelChild && this._control && this._control.placeholder) || (this._labelChild && this._placeholderChild)) {
      return true;
    }
    return false;
  }

  /** @ignore */
  _isEmpty() {
    const val = this._control ? this._control.value : null;
    return val === '' || val === null || val === undefined;
  }

  private _updateFloatingLabel() {
    if (this._labelContainer2) {
      const isFloating = this._control!.floatingLabel || this.floatingLabel;
      if (this._isFloating !== isFloating) {
        this._isFloating = isFloating;
        if (isFloating) {
          this._renderer.addClass(this._labelContainer2.nativeElement, this.classes.floatingLabel);
          this._renderer.addClass(this._el.nativeElement, this.classes.isFloatingLabel);
        } else {
          this._renderer.removeClass(this._labelContainer2.nativeElement, this.classes.floatingLabel);
          this._renderer.removeClass(this._el.nativeElement, this.classes.isFloatingLabel);
        }
      }
    }
    if (this._control) {
      if (this._control.focused) {
        this._renderer.addClass(this._el.nativeElement, this.classes.focused);
      } else {
        this._renderer.removeClass(this._el.nativeElement, this.classes.focused);
      }
    }
  }

  private _markForCheck() {
    this._cd.markForCheck();
  }

  _getHostElement() {
    return this._el.nativeElement;
  }

}

@Directive({
  selector:
      'input[lyInput], textarea[lyInput], input[lyNativeControl], textarea[lyNativeControl], select[lyNativeControl]',
  exportAs: 'LyNativeControl',
  providers: [
    { provide: LyFieldControlBase, useExisting: LyNativeControl }
  ]
})
export class LyNativeControl implements LyFieldControlBase, OnInit, DoCheck, OnDestroy {
  protected _disabled = false;
  protected _required = false;
  protected _placeholder: string;
  readonly stateChanges: Subject<void> = new Subject<void>();
  private _hasDisabledClass?: boolean;
  private _errorClass?: string;
  private _cursorClass: string | null;
  private _isSelectInput: boolean;
  private _form: NgForm | FormGroupDirective | null = this._parentForm || this._parentFormGroup;
  _focused: boolean = false;
  errorState: boolean = false;

  @HostListener('input') _onInput() {
    this.stateChanges.next();
  }

  @HostListener('blur') _onBlur() {
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

  /** @ignore */
  @Input()
  set value(val) {
    if (val !== this.value) {
      this._getHostElement().value = val;
      this.stateChanges.next();
    }
  }
  get value() {
    return this._getHostElement().value;
  }

  /** Whether the input is disabled. */
  @HostBinding()
  @Input()
  set disabled(val: boolean) {
    if (val !== this._disabled) {
      this._disabled = toBoolean(val);
      if (this._field) {
        if (!val && this._hasDisabledClass) {
          this._renderer.removeClass(this._field._getHostElement(), this._field.classes.disabled);
          if (this._cursorClass) {
            this._renderer.addClass(this._field._getHostElement(), this._cursorClass);
          }
          this._hasDisabledClass = undefined;
        } else if (val) {
          this._renderer.addClass(this._field._getHostElement(), this._field.classes.disabled);
          if (this._cursorClass) {
            this._renderer.removeClass(this._field._getHostElement(), this._cursorClass);
          }
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

  @HostBinding()
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
    return val === '' || val == null;
  }

  get floatingLabel() {
    return this.focused || !this.empty || (this._isSelectInput ? this._hasLabelSelectionOption() : false);
  }

  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    private _renderer: Renderer2,
    @Optional() private _field: LyField,
    /** @docs-private */
    @Optional() @Self() public ngControl: NgControl,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective
  ) { }

  ngOnInit() {
    this._renderer.setAttribute(this._getHostElement(), 'placeholder', '­');

    const { nativeElement } = this._el;

    if (nativeElement.nodeName.toLowerCase() === 'select') {
      this._isSelectInput = true;
    }

    // apply class {selectArrow} to `<select> not multiple`
    if (this._field && nativeElement.type === 'select-one') {
      this._renderer.addClass(this._field._getHostElement(), this._field.classes.selectArrow);
    }

    // apply style cursor only for input of type text
    if (nativeElement instanceof HTMLTextAreaElement ||
        inputText.some(type => type === nativeElement.type)) {
      this._cursorClass = this._theme.addSimpleStyle('lyField.text', {
        '& {infix}': {
          cursor: 'text'
        }
      }, STYLE_PRIORITY, STYLES);
    }

    if (this._isSelectInput) {
      this._cursorClass = this._theme.addSimpleStyle('lyField.select', {
        '& {infix}': {
          cursor: 'pointer'
        }
      }, STYLE_PRIORITY, STYLES);
    }

    if (this._cursorClass) {
      this._renderer.addClass(this._field._getHostElement(), this._cursorClass);
    }

    // apply default styles
    this._renderer.addClass(nativeElement, this._field.classes.inputNative);

    const ngControl = this.ngControl;
    // update styles on disabled
    if (ngControl && ngControl.statusChanges) {
      ngControl.statusChanges.subscribe(() => {
        this.disabled = !!ngControl.disabled;
      });
    }
  }

  ngDoCheck() {
    if (this._field._control) {
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
          this.stateChanges.next();
        }
      }
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  /** @docs-private */
  onContainerClick(_e: MouseEvent) {
    this._getHostElement().focus();
  }

  /** Focuses the input. */
  focus(): void { this._getHostElement().focus(); }

  _getHostElement() {
    return this._el.nativeElement;
  }

  private _hasLabelSelectionOption() {
    const el = this._getHostElement() as HTMLSelectElement;
    const option = el.selectedOptions ? el.selectedOptions.item(0) : null;
    return option ? !!option.label : false;
  }

}
