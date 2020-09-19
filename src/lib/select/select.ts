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
  QueryList,
  ContentChildren,
  AfterContentInit,
  Directive,
  ContentChild,
  Output,
  EventEmitter,
  isDevMode,
  } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm
  } from '@angular/forms';
import { LyField, LyFieldControlBase, STYLES as FIELD_STYLES } from '@alyle/ui/field';
import {
  LyOverlay,
  LyTheme2,
  OverlayFactory,
  shadowBuilder,
  ThemeVariables,
  toBoolean,
  Positioning,
  CanDisableCtor,
  mixinDisableRipple,
  mixinTabIndex,
  LyRippleService,
  XPosition,
  YPosition,
  Dir,
  lyl,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  ThemeRef,
  StyleRenderer,
  Style,
  WithStyles
  } from '@alyle/ui';
import { Subject, Observable, defer, merge } from 'rxjs';
import { take, takeUntil, startWith, switchMap, distinctUntilChanged, filter, mapTo } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';
import { FocusableOption, FocusOrigin, ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ENTER, SPACE, hasModifierKey, DOWN_ARROW, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, A } from '@angular/cdk/keycodes';
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { getLySelectNonFunctionValueError, getLySelectNonArrayValueError } from './select-errors';


export interface LySelectTheme {
  /** Styles for Select Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LySelectVariables {
  select?: LySelectTheme;
}

const DEFAULT_DISABLE_RIPPLE = false;
const STYLE_PRIORITY = -2;
export const STYLES = (theme: ThemeVariables & LySelectVariables, ref: ThemeRef) => {
  const select = ref.selectorsOf(STYLES);
  const { after } = theme;
  return {
    $priority: STYLE_PRIORITY,
    root: () => lyl `{
      display: block
      position: relative
      padding-${after}: 1em
      min-height: 1em
      -webkit-tap-highlight-color: transparent
      {
        ...${
          (theme.select
            && theme.select.root
            && (theme.select.root instanceof StyleCollection
              ? theme.select.root.setTransformer(fn => fn(select))
              : theme.select.root(select))
          )
        }
      }
    }`,
    container: {
      background: theme.background.primary.default,
      borderRadius: '2px',
      boxShadow: shadowBuilder(4),
      display: 'block',
      transformOrigin: 'inherit',
      pointerEvents: 'all',
      overflow: 'auto',
      maxHeight: '256px'
    },
    valueText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
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
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      userSelect: 'none',
      lineHeight: 1.125,
      height: '3em',
      cursor: 'pointer',
    },
    optionActive: lyl `{
      background: ${theme.hover}
    }`,
    optionText: {
      'ly-checkbox ~ &': {
        marginBefore: '-1em',
        display: 'flex',
        alignItems: 'inherit',
        alignContent: 'inherit'
      }
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
  };
};

/** Change event object that is emitted when the select value has changed. */
export class LySelectChange {
  constructor(
    /** Reference to the select that emitted the change event. */
    public source: LySelect,
    /** Current value of the select that emitted the event. */
    public value: any) { }
}

/** @docs-private */
const ANIMATIONS = [
  trigger('selectEnter', [
    transition('void => in', [
      animate('125ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
        style({
          opacity: 0,
          transform: 'scaleY(0.9)'
        }),
        style({
          opacity: 1,
          transform: 'scaleY(1)'
        })
      ]))
    ]),
    transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 })))
  ]),
];

/** @docs-private */
export class LySelectBase { }
/** @docs-private */
export const LySelectMixinBase = mixinTabIndex(LySelectBase as CanDisableCtor);

/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
@Directive({
  selector: 'ly-select-trigger'
})
export class LySelectTrigger { }


@Component({
  selector: 'ly-select',
  templateUrl: 'select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySelect',
  host: {
    '[attr.tabindex]': 'tabIndex',
    '(keydown)': '_handleKeydown($event)',
    '(focus)': '_onFocus()',
    '(blur)': '_onBlur()',
  },
  animations: [...ANIMATIONS],
  inputs: ['tabIndex'],
  providers: [
    StyleRenderer,
    { provide: LyFieldControlBase, useExisting: LySelect }
  ]
})
export class LySelect
    extends LySelectMixinBase
    implements ControlValueAccessor, LyFieldControlBase, OnInit, DoCheck, AfterContentInit, OnDestroy {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(STYLES);
  /** @internal */
  _selectionModel: SelectionModel<LyOption>;
  /** @internal */
  _value: any;

  /** The cached font-size of the trigger element. */
  _triggerFontSize = 0;

  private _overlayRef: OverlayFactory | null;
  protected _disabled = false;
  protected _required = false;
  protected _placeholder: string;
  readonly stateChanges: Subject<void> = new Subject<void>();
  private _hasDisabledClass?: boolean;
  private _errorClass?: string;
  private _form: NgForm | FormGroupDirective | null = this._parentForm || this._parentFormGroup;
  private _multiple: boolean;
  private _opened: boolean;
  private _valueKey: (opt: unknown) => unknown = same;
  _focused: boolean = false;
  errorState: boolean = false;
  private _cursorClass: string;

  /** Manages keyboard events for options in the panel. */
  _keyManager: ActiveDescendantKeyManager<LyOption>;

  /** Emits when the panel element is finished transforming in. */
  _panelDoneAnimatingStream = new Subject<string>();

  /** Comparison function to specify which option is displayed. Defaults to object equality. */
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** Combined stream of all of the child options' change events. */
  readonly optionSelectionChanges: Observable<LyOptionSelectionChange> = defer(() => {
    const options = this.options;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() => merge(...options.map(option => option.onSelectionChange)))
      );
    }

    return this._ngZone.onStable
      .pipe(take(1), switchMap(() => this.optionSelectionChanges));
  }) as Observable<LyOptionSelectionChange>;

  @ViewChild('templateRef') templateRef: TemplateRef<any>;
  @ViewChild('valueText') valueTextDivRef: ElementRef<HTMLDivElement>;
  /** @internal */
  @ViewChild(forwardRef(() => LyOption)) _options: QueryList<LyOption>;
  @ContentChildren(forwardRef(() => LyOption), { descendants: true }) options: QueryList<LyOption>;
  @ContentChild(LySelectTrigger) customTrigger: LySelectTrigger;

  /** Event emitted when the select panel has been toggled. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted when the select has been opened. */
  @Output('opened') readonly _openedStream: Observable<void> =
      this.openedChange.pipe(filter(o => o), mapTo(null!));

  /** Event emitted when the select has been closed. */
  @Output('closed') readonly _closedStream: Observable<void> =
      this.openedChange.pipe(filter(o => !o), mapTo(null!));

  /** Event emitted when the selected value has been changed by the user. */
  @Output() readonly selectionChange: EventEmitter<LySelectChange> = new EventEmitter<LySelectChange>();

  /**
   * Event that emits whenever the raw value of the select changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The registered callback function called when a change event occurs on the input element.
   */
  onChange = (_: any) => {};

  /**
   * The registered callback function called when a blur event occurs on the input element.
   */
  onTouched = () => {};

  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }
  _onBlur() {
    this._focused = false;
    if (!this.disabled && !this._opened) {
      this.onTouched();
      this._cd.markForCheck();
      this.stateChanges.next();
    }
  }

  /** Time to wait in milliseconds after the last keystroke before moving focus to an item. */
  @Input()
  get typeaheadDebounceInterval(): number { return this._typeaheadDebounceInterval; }
  set typeaheadDebounceInterval(value: number) {
    const newVal = coerceNumberProperty(value);
    if (this._typeaheadDebounceInterval !== newVal && this._keyManager) {
      this._typeaheadDebounceInterval = newVal;
      this._keyManager.withTypeAhead(newVal);
    }
  }
  private _typeaheadDebounceInterval: number;

  /** Value of the select control. */
  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (newValue !== this._value) {
      if (this.options) {
        this._setSelectionByValue(newValue);
      }

      this._value = newValue;
    }
  }

  /** Whether the input is disabled. */
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
      this.stateChanges.next();
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

  /**
   * @deprecated has been deprecated in favor of `compareWith`
   */
  @Input()
  set valueKey(fn: (opt: unknown) => unknown) {
    this._valueKey = fn;
    console.warn('LySelect: `[valueKey]` has been deprecated in favor of `[compareWith]`');
  }
  get valueKey(): (opt: unknown) => unknown { return this._valueKey; }

  @Input()
  set placeholder(val: string) {
    this._placeholder = val;
  }
  get placeholder(): string { return this._placeholder; }

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input()
  get compareWith() { return this._compareWith; }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function' && isDevMode) {
      throw getLySelectNonFunctionValueError();
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }

  /**
   * Function used to sort the values in a select in multiple mode.
   * Follows the same logic as `Array.prototype.sort`.
   */
  @Input() sortComparator: (a: LyOption, b: LyOption, options: LyOption[]) => number;

  get focused() {
    return this._focused;
  }

  get empty() {
    return !this._selectionModel || this._selectionModel.isEmpty();
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

  /** Current selecteds */
  get selected(): LyOption | LyOption[] {
    const selected = this._selectionModel.selected;
    return this.multiple ? selected : selected[0];
  }

  constructor(private _theme: LyTheme2,
              readonly sRenderer: StyleRenderer,
              private _renderer: Renderer2,
              private _el: ElementRef,
              private _overlay: LyOverlay,
              /** @internal */
              @Optional() public _field: LyField,
              /** @internal */
              public _cd: ChangeDetectorRef,
              private _ngZone: NgZone,
              /** @docs-private */
              @Optional() @Self() public ngControl: NgControl,
              @Optional() private _parentForm: NgForm,
              @Optional() private _parentFormGroup: FormGroupDirective) {
    super();
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this._cursorClass = this._theme.addStyle('lyField.select', {
      '& {container}': {
        cursor: 'pointer'
      }
    }, this._field._getHostElement(), null, STYLE_PRIORITY, FIELD_STYLES);

  }

  ngOnInit() {
    this._selectionModel = new SelectionModel<LyOption>(this.multiple);
    this.stateChanges.next();

    // We need `distinctUntilChanged` here, because some browsers will
    // fire the animation end event twice for the same animation. See:
    // https://github.com/angular/angular/issues/24084
    this._panelDoneAnimatingStream
      .pipe(distinctUntilChanged(), takeUntil(this._destroy))
      .subscribe(() => {
        if (this._opened) {
          this.openedChange.emit(true);
        } else {
          if (this._overlayRef) {
            this._overlayRef.remove();
            this._overlayRef = null;
          }
          this.openedChange.emit(false);
          this.stateChanges.next();
          this._cd.markForCheck();
        }
      });

    const ngControl = this.ngControl;

    // update styles on disabled
    if (ngControl && ngControl.statusChanges) {
      ngControl.statusChanges.pipe(takeUntil(this._destroy)).subscribe(() => {
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
        this.stateChanges.next();
      }
    }
  }

  ngAfterContentInit() {
    this._initKeyManager();

    this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
      this._resetOptions();
      this._initializeSelection();
    });

    this._selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe(event => {
      event.added.forEach(option => option.select());
      event.removed.forEach(option => option.deselect());
    });

    Promise.resolve().then(() => {
      this.value = this.ngControl ? this.ngControl.value : this._value;
      this.stateChanges.next();
      this._cd.markForCheck();
    });
    this._keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (!this._opened && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
    if (this._overlayRef) {
      this._overlayRef.destroy();
    }
  }

  open() {
    if (this.disabled || !this.options || !this.options.length || this._opened) {
      return;
    }
    this._opened = true;
    if (this._overlayRef) {
      this._overlayRef.destroy();
    }
    this._overlayRef = this._overlay.create(this.templateRef, null, {
      styles: {
        top: 0,
        left: 0,
        pointerEvents: null
      },
      fnDestroy: this.close.bind(this),
      onResizeScroll: this._updatePlacement.bind(this)
    });
    this._keyManager.withHorizontalOrientation(null);
    this._triggerFontSize = parseInt(getComputedStyle(this._getHostElement()).fontSize || '0');
    this._highlightCorrectOption();
    this._cd.markForCheck();
    this.stateChanges.next();
    this._ngZone.onStable.pipe(
      take(1)
    ).subscribe(() => this._updatePlacement(true));
  }

  close() {
    if (this._opened) {
      this._opened = false;
      this._overlayRef?.detach();
      this._keyManager.withHorizontalOrientation(this._theme.variables.direction);
      this._cd.markForCheck();
      this.onTouched();
    }
  }

  /** @docs-private */
  onContainerClick() {
    this.focus();
    this.open();
  }

  /** Focuses the select element. */
  focus(options?: FocusOptions): void {
    this._getHostElement().focus(options);
  }

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
  }

  /**
   * Registers a function called when the control value changes.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: (value: any) => any): void {
    this.onChange = (_valueString: string) => {
      fn(this.value);
    };
  }

  /**
   * Registers a function called when the control is touched.
   *
   * @param fn The callback function
   */
  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  /**
   * Disables the select. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._cd.markForCheck();
    this.stateChanges.next();
  }

  /** Handles all keydown events on the select. */
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this._opened ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
    }
  }

  /** Handles keyboard events while the select is closed. */
  private _handleClosedKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW ||
                       keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this._keyManager;

    // Open the select on ALT + arrow key to match the native <select>
    if (!manager.isTyping() && (isOpenKey && !hasModifierKey(event)) ||
      ((this.multiple || event.altKey) && isArrowKey)) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.open();
    } else if (!this.multiple) {
      manager.onKeydown(event);
    }
  }

  /** Handles keyboard events when the selected is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const manager = this._keyManager;
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const isTyping = manager.isTyping();

    if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
      // Don't do anything in this case if the user is typing,
      // because the typing sequence can include the space key.
    } else if (!isTyping && (keyCode === ENTER || keyCode === SPACE) && manager.activeItem &&
      !hasModifierKey(event)) {
      event.preventDefault();
      manager.activeItem._selectViaInteraction();
    } else if (!isTyping && this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      const hasDeselectedOptions = this.options.some(opt => !opt.disabled && !opt.selected);

      this.options.forEach(option => {
        if (!option.disabled) {
          hasDeselectedOptions ? option.select() : option.deselect();
        }
      });
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;

      manager.onKeydown(event);

      if (this._multiple && isArrowKey && event.shiftKey && manager.activeItem &&
          manager.activeItemIndex !== previouslyFocusedIndex) {
        manager.activeItem._selectViaInteraction();
      }
    }
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value);
      this.stateChanges.next();
    });
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: any | any[]): void {
    if (this.multiple && value) {
      if (!Array.isArray(value) && isDevMode()) {
        throw getLySelectNonArrayValueError();
      }

      this._selectionModel.clear();
      value.forEach((currentValue: any) => this._selectValue(currentValue));
      this._sortValues();
    } else {
      this._selectionModel.clear();
      const correspondingOption = this._selectValue(value);

      // Shift focus to the active item. Note that we shouldn't do this in multiple
      // mode, because we don't know what option the user interacted with last.
      if (correspondingOption) {
        this._keyManager.updateActiveItem(correspondingOption);
      } else if (!this._opened) {
        // Otherwise reset the highlighted option. Note that we only want to do this while
        // closed, because doing it while open can shift the user's focus unnecessarily.
        this._keyManager.updateActiveItem(-1);
      }
    }

    this._cd.markForCheck();
  }

  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private _selectValue(value: any): LyOption | undefined {
    const correspondingOption = this.options.find((option: LyOption) => {
      if (this._valueKey !== same) {
        return this.valueKey(option.value) === this.valueKey(value);
      }
      try {
        // Treat null as a special reset value.
        return option.value != null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          // Notify developers of errors in their comparator.
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }

  private _updatePlacement(updateScroll: boolean) {
    const el = this._overlayRef!.containerElement as HTMLElement;
    const container = el.querySelector('div')!;
    const triggerFontSize = this._triggerFontSize;
    const { nativeElement } = this.valueTextDivRef;
    let panelWidth: number;

    if (this.multiple) {
      panelWidth = nativeElement.offsetWidth + triggerFontSize * 4;
    } else {
      panelWidth = nativeElement.offsetWidth + triggerFontSize * 2;
    }


    // reset height & width
    this._renderer.setStyle(container, 'height', 'initial');
    this._renderer.setStyle(container, 'width', `${panelWidth}px`);


    let selectedElement: HTMLElement | null = this._selectionModel.isEmpty()
        ? el.querySelector('ly-option')
        : this._selectionModel.selected[0]._getHostElement() as HTMLElement;

    if (!selectedElement) {
      selectedElement = (el.firstElementChild!.firstElementChild! || el.firstElementChild!) as HTMLElement;
    }

    const offset = {
      y: -(nativeElement.offsetHeight / 2 + selectedElement.offsetTop + selectedElement.offsetHeight / 2),
      x: -triggerFontSize
    };

    // scroll to selected option
    if (container.scrollHeight !== container.offsetHeight) {
      if (updateScroll) {
        if (container.scrollTop === selectedElement.offsetTop) {
          container.scrollTop = container.scrollTop - (container.offsetHeight / 2) + selectedElement.offsetHeight / 2;
        } else {
          container.scrollTop = container.scrollTop
          - (container.offsetHeight / 2 - (selectedElement.offsetTop - container.scrollTop)) + selectedElement.offsetHeight / 2;
        }
      }
      offset.y = container.scrollTop + offset.y;
    }

    if (this.multiple) {
      offset.x -= 24;
    }

    const position = new Positioning(
      YPosition.below,
      XPosition.after,
      null as any,
      nativeElement,
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
    const width = position.width === 'initial'
          ? `${panelWidth}px`
          : position.width;
    this._renderer.setStyle(container, 'width', width);
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager<LyOption>(this.options)
      .withTypeAhead(this._typeaheadDebounceInterval)
      .withVerticalOrientation()
      .withHorizontalOrientation(this._theme.variables.direction)
      .withHomeAndEnd()
      .withAllowedModifierKeys(['shiftKey']);

    this._keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._opened) {
        // Select the active item when tabbing away. This is consistent with how the native
        // select behaves. Note that we only want to do this in single selection mode.
        if (!this.multiple && this._keyManager.activeItem) {
          this._keyManager.activeItem._selectViaInteraction();
        }

        // Restore focus to the trigger before closing. Ensures that the focus
        // position won't be lost if the user got focus into the overlay.
        this.focus();
        this.close();
      }
    });

    this._keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._opened) {
        this._scrollActiveOptionIntoView();
      } else if (!this._opened && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }

  /** Sorts the selected values in the selected based on their order in the panel. */
  private _sortValues() {
    if (this.multiple) {
      const options = this.options.toArray();

      this._selectionModel.sort((a, b) => {
        return this.sortComparator ? this.sortComparator(a, b, options) :
                                     options.indexOf(a) - options.indexOf(b);
      });
      this.stateChanges.next();
    }
  }

  private _resetOptions(): void {
    const changedOrDestroyed = merge(this.options.changes, this._destroy);

    this.optionSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe(event => {
      this._onSelect(event.source, event.isUserInput);

      if (event.isUserInput && !this.multiple && this._opened) {
        this.close();
        this.focus();
      }
    });
  }

  /** Invoked when an option is clicked. */
  private _onSelect(option: LyOption, isUserInput: boolean): void {
    const wasSelected = this._selectionModel.isSelected(option);

    if (option.value == null && !this._multiple) {
      option.deselect();
      this._selectionModel.clear();

      if (this.value != null) {
        this._propagateChanges(option.value);
      }
    } else {
      if (wasSelected !== option.selected) {
        option.selected ? this._selectionModel.select(option) :
                          this._selectionModel.deselect(option);
      }

      if (isUserInput) {
        this._keyManager.setActiveItem(option);
      }

      if (this.multiple) {
        this._sortValues();
        if (isUserInput) {
          // In case the user selected the option with their mouse, we
          // want to restore focus back to the trigger, in order to
          // prevent the select keyboard controls from clashing with
          // the ones from `ly-option`.
          this.focus();
        }
      }
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this.stateChanges.next();
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: any): void {
    let valueToEmit: any = null;

    if (this.multiple) {
      valueToEmit = (this.selected as LyOption[]).map(option => option.value);
    } else {
      valueToEmit = this.selected ? (this.selected as LyOption).value : fallbackValue;
    }

    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this.onChange(valueToEmit);
    this.selectionChange.emit(new LySelectChange(this, valueToEmit));
    this._cd.markForCheck();
  }

  /**
   * Highlights the selected item. If no option is selected, it will highlight
   * the first item instead.
   */
  private _highlightCorrectOption(): void {
    if (this._keyManager) {
      if (this.empty) {
        this._keyManager.setFirstItemActive();
      } else {
        this._keyManager.setActiveItem(this._selectionModel.selected[0]);
      }
    }
  }

  /** Scrolls the active option into view. */
  private _scrollActiveOptionIntoView(): void {
    const el = this._overlayRef!.containerElement as HTMLElement;
    const container = el.querySelector('div')!;
    const activeOption = this._keyManager.activeItem!._getHostElement();
    // const containerRect = container.getBoundingClientRect();
    // const activeOptionRect = ;
    if (typeof activeOption.scrollIntoView === 'function') {
      if (container.scrollTop > activeOption.offsetTop) {
        container.scrollTop = activeOption.offsetTop;
      } else if (
        container.scrollTop + container.offsetHeight < activeOption.offsetTop + activeOption.offsetHeight
      ) {
        container.scrollTop = activeOption.offsetTop - container.offsetHeight + activeOption.offsetHeight;
      }
    }
  }

}

/** Event object emitted by LyOption when selected or deselected. */
export class LyOptionSelectionChange {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: LyOption,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput = false) { }
}

/** @docs-private */
export class LyOptionBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone,
    public _platform: Platform
  ) { }
}

/** @docs-private */
export const LyOptionMixinBase = mixinDisableRipple(LyOptionBase);

/**
 * @dynamic
 */
@Component({
  selector: 'ly-option',
  templateUrl: './option.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'option',
    '(keydown)': '_handleKeydown($event)',
    '[attr.tabindex]': '_getTabIndex()',
  },
  inputs: [
    'disableRipple'
  ],
  providers: [
    StyleRenderer
  ]
})
export class LyOption extends LyOptionMixinBase implements WithStyles, FocusableOption, OnInit, OnChanges {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _value: any;
  private _selected = false;
  private _disabled = false;

  @ViewChild('rippleContainer') _rippleContainer: ElementRef;

  /** Event emitted when the option is selected or deselected. */
  // tslint:disable-next-line: no-output-on-prefix
  @Output() readonly onSelectionChange = new EventEmitter<LyOptionSelectionChange>();

  @HostListener('click') _onClick() {
    this._selectViaInteraction();
  }

  /** Whether or not the option is currently selected. */
  get selected(): boolean { return this._selected; }

  /** Whether the wrapping component is in multiple selection mode. */
  get multiple() { return this._select && this._select.multiple; }

  /**
   * Tracks simple string values bound to the option element.
   */
  @Input('value')
  set value(value: any) {
    this._value = value;
  }
  get value() {
    return this._value;
  }

  /** Whether the option is disabled. */
  @Input()
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }
  get disabled() {
    return this._disabled;
  }

  @Style<string | null>(
    value => (theme: ThemeVariables) => lyl `{
      color: ${theme.colorOf(value)}
    }`
  )
  _selectedColor: string | null;

  /** The displayed value of the option. */
  get viewValue(): string {
    return ((this._getHostElement() as Element).textContent || '').trim();
  }

  /** The color of Select option */
  get _color() {
    return this._selected ? this._select._field.color : null;
  }

  /**
   * @deprecated use instead `selected`
   */
  get isSelected(): boolean {
    return this._selected;
  }

  constructor(readonly sRenderer: StyleRenderer,
              /** @internal */
              readonly _select: LySelect,
              private _el: ElementRef,
              /** @internal */
              public _rippleService: LyRippleService,
              _renderer: Renderer2,
              _theme: LyTheme2,
              /** @internal */
              public _cd: ChangeDetectorRef,
              _ngZone: NgZone,
              platform: Platform
  ) {
    super(_theme, _ngZone, platform);
    _renderer.addClass(_el.nativeElement, this.classes.option);
    this._triggerElement = _el;
  }

  ngOnInit() {
    if (this.disableRipple == null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  ngOnChanges() { }

  /** Applies the styles for an active item to this item. */
  setActiveStyles(): void {
    this.sRenderer.addClass(this.classes.optionActive);
  }

  /** Applies the styles for an inactive item to this item. */
  setInactiveStyles(): void {
    this.sRenderer.removeClass(this.classes.optionActive);
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    return this.viewValue;
  }

  /** Selects the option. */
  select(): void {
    if (!this._selected) {
      this._selected = true;
      this._selectedColor = this._color;
      this._cd.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Deselects the option. */
  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this._selectedColor = null;
      this._cd.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Sets focus onto this option. */
  focus(_origin?: FocusOrigin, options?: FocusOptions) {
    const element = this._getHostElement();

    if (typeof element.focus === 'function') {
      element.focus(options);
    }
  }

  /** Ensures the option is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !hasModifierKey(event)) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  /**
   * `Selects the option while indicating the selection came from the user. Used to
   * determine if the select's view -> model callback should be invoked.`
   */
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = this.multiple ? !this._selected : true;
      this._selectedColor = this._color;
      this._cd.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** @internal */
  _getHostElement(): HTMLElement {
    return this._el.nativeElement;
  }

  /** Returns the correct tabindex for the option depending on disabled state. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new LyOptionSelectionChange(this, isUserInput));
  }

}

function same(o: unknown): unknown {
  return o;
}
