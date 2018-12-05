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
  OnChanges,
  SimpleChanges,
  isDevMode
  } from '@angular/core';
import { LY_COMMON_STYLES, LyTheme2, ThemeVariables, mergeDeep, ElementObserver, Platform, toBoolean, DirAlias, mixinColor } from '@alyle/ui';
import { LyInputNative } from './input';
import { LyLabel } from './label';
import { LyPlaceholder } from './placeholder';
import { LyHint } from './hint';
import { LyPrefix } from './prefix';
import { LySuffix } from './suffix';

const STYLE_PRIORITY = -2;
const DEFAULT_APPEARANCE = 'standard';
const DEFAULT_APPEARANCE_THEME = {
  standard: {
    container: {
      padding: '1em 0 0',
      '&:after': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px'
      },
      '&:hover:after': {
        borderBottomColor: 'currentColor'
      }
    },
    containerFocused: {
      '&:after': {
        borderWidth: '2px',
        borderColor: 'currentColor'
      }
    },
    containerLabelHover: {
      color: 'currentColor'
    },
    label: {
      margin: '0.4375em 0'
    },
    placeholder: {
      margin: '0.4375em 0'
    },
    input: {
      margin: '0.4375em 0'
    },
    floatingLabel: {
      transform: 'translateY(-1.25em)'
    }
  }
};
const DEFAULT_WITH_COLOR = 'primary';
const styles = (theme: ThemeVariables) => {
  return {
    root: {
      display: 'inline-block',
      position: 'relative',
      marginBottom: '.5em',
      lineHeight: 1.125
    },
    animations: {
      '& {labelSpan}': {
        transition: `font-size ${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s`
      },
      '& {label}': {
        transition: `${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s`
      }
    },
    container: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      '&:after': {
        ...LY_COMMON_STYLES.fill,
        content: `\'\'`,
        pointerEvents: 'none',
        borderColor: theme.field.borderColor
      }
    },
    fieldset: {
      ...LY_COMMON_STYLES.fill,
      margin: 0,
      borderStyle: 'solid',
      borderColor: theme.field.borderColor,
      borderWidth: 0
    },
    fieldsetSpan: {
      padding: 0,
      height: '2px'
    },
    labelSpan: {
      maxWidth: '100%',
      display: 'inline-block'
    },
    prefix: {
      maxHeight: '2em',
      display: 'flex',
      alignItems: 'center',
      '&:after': {
        content: `\'\'`,
        pointerEvents: 'none',
        boxSizing: 'content-box',
        ...LY_COMMON_STYLES.fill,
        borderColor: theme.field.borderColor
      }
    },
    infix: {
      display: 'inline-flex',
      position: 'relative',
      alignItems: 'baseline',
      width: '100%',
      '&:after': {
        content: `\'\'`,
        pointerEvents: 'none',
        boxSizing: 'content-box',
        ...LY_COMMON_STYLES.fill,
        borderColor: theme.field.borderColor
      }
    },
    suffix: {
      maxHeight: '2em',
      display: 'flex',
      alignItems: 'center',
      '&:after': {
        content: `\'\'`,
        pointerEvents: 'none',
        boxSizing: 'content-box',
        ...LY_COMMON_STYLES.fill,
        borderColor: theme.field.borderColor
      }
    },
    labelContainer: {
      ...LY_COMMON_STYLES.fill,
      pointerEvents: 'none',
      display: 'flex',
      width: '100%',
      borderColor: theme.field.borderColor
    },
    labelSpacingStart: {},
    labelCenter: {
      display: 'flex',
      maxWidth: '100%'
    },
    labelSpacingEnd: {
      flex: 1
    },
    label: {
      ...LY_COMMON_STYLES.fill,
      margin: 0,
      border: 'none',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: theme.field.labelColor,
      width: '100%'
    },
    isFloatingLabel: {},
    floatingLabel: {
      '& {labelSpan}': {
        fontSize: '75%'
      }
    },
    placeholder: {
      ...LY_COMMON_STYLES.fill,
      pointerEvents: 'none',
      color: theme.field.labelColor
    },
    focused: {},
    inputNative: {
      resize: 'vertical',
      padding: 0,
      outline: 'none',
      border: 'none',
      backgroundColor: 'transparent',
      color: 'inherit',
      font: 'inherit',
      width: '100%'
    },
    hint: { }
  };
};

/** @docs-private */
export class LyFieldBase { }

/** @docs-private */
export const LyFieldMixinBase = mixinColor(LyFieldBase);

@Component({
  selector: 'ly-field',
  templateUrl: 'field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: ['color']
})
export class LyField extends LyFieldMixinBase implements OnChanges, OnInit, AfterContentInit, AfterViewInit {
  /**
   * styles
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, STYLE_PRIORITY);
  protected _appearance: string;
  protected _appearanceClass: string;
  protected _withColor: string;
  protected _withColorClass: string;
  protected _isFloating: boolean;
  protected _floatingLabel: boolean;
  private _fielsetSpanClass: string;
  private _marginStartClass: string;
  private _marginEndClass: string;
  @ViewChild('_labelContainer') _labelContainer: ElementRef<HTMLDivElement>;
  @ViewChild('_labelContainer2') _labelContainer2: ElementRef<HTMLDivElement>;
  @ViewChild('_labelSpan') _labelSpan: ElementRef<HTMLDivElement>;
  @ViewChild('_prefixContainer') _prefixContainer: ElementRef<HTMLDivElement>;
  @ViewChild('_suffixContainer') _suffixContainer: ElementRef<HTMLDivElement>;
  @ViewChild('_fieldsetLegend') _fieldsetLegend: ElementRef<HTMLDivElement>;
  @ContentChild(LyInputNative) _input: LyInputNative;
  @ContentChild(LyPlaceholder) _placeholderChild: LyPlaceholder;
  @ContentChild(LyLabel) _labelChild: LyLabel;
  @ContentChildren(LyHint) _hintChildren: QueryList<LyHint>;
  @ContentChildren(LyPrefix) _prefixChildren: QueryList<LyPrefix>;
  @ContentChildren(LySuffix) _suffixChildren: QueryList<LySuffix>;

  /** Whether the label is floating. */
  @Input()
  set floatingLabel(val: boolean) {
    this._floatingLabel = toBoolean(val);
    this._updateFloatingLabel();
  }
  get floatingLabel() {
    return this._floatingLabel;
  }

  /** Deprecated, instead use `[color], theme color for the component. */
  @Input()
  set withColor(val: string) {
    if (val !== this._withColor) {
      this._withColor = val;
      this._withColorClass = this._theme.addStyle(`ly-field.withColor:${val}`, (theme: ThemeVariables) => {
        const color = theme.colorOf(val);
        return {
          [`&.${this.classes.focused} .${this.classes.container}:after`]: {
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
          }
        };
      }, this._el.nativeElement, this._withColorClass, STYLE_PRIORITY + 1);
    }
  }
  get withColor() {
    return this._withColor;
  }

  /** The field appearance style. */
  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      if (!(this._theme.config.field.appearance[val] || DEFAULT_APPEARANCE_THEME[val]))  {
        throw new Error(`${val} not found in theme.field.appearance`);
      }
      this._appearanceClass = this._theme.addStyle(`ly-field.appearance:${val}`, (theme: ThemeVariables) => {
        const appearance = mergeDeep({}, theme.field.appearance.any, theme.field.appearance[val] || DEFAULT_APPEARANCE_THEME[val]);
        return {
          [`& .${this.classes.container}`]: {...appearance.container},
          [`& .${this.classes.prefix}`]: {...appearance.prefix},
          [`& .${this.classes.infix}`]: {...appearance.infix},
          [`& .${this.classes.suffix}`]: {...appearance.suffix},
          [`& .${this.classes.inputNative}`]: {...appearance.input},
          [`& .${this.classes.fieldset}`]: {...appearance.fieldset},
          [`&:hover .${this.classes.fieldset}`]: {...appearance.fieldsetHover},
          [`&.${this.classes.focused} .${this.classes.fieldset}`]: {...appearance.fieldsetFocused},
          [`& .${this.classes.placeholder}`]: {
            ...appearance.placeholder
          },
          [`& .${this.classes.label}`]: {
            ...appearance.label
          },
          [`& .${this.classes.hint}`]: {
            ...appearance.hint
          },
          [`& .${this.classes.floatingLabel}.${this.classes.label}`]: {...appearance.floatingLabel},

          [`&.${this.classes.focused} .${this.classes.container}`]: {
            ...appearance.containerFocused
          },
        };
      }, this._el.nativeElement, this._appearanceClass, STYLE_PRIORITY);
    }
  }
  get appearance() {
    return this._appearance;
  }
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _elementObserver: ElementObserver,
    private _theme: LyTheme2,
    private _cd: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    super();
    _renderer.addClass(_el.nativeElement, this.classes.root);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.color) {
      this.withColor = changes.color.currentValue;
    }
    if (isDevMode() && changes.withColor) {
      console.warn('`LyField` > `[withColor]` is deprecated, instead use `[color]`');
    }
  }

  ngOnInit() {
    if (!this.withColor) {
      this.withColor = DEFAULT_WITH_COLOR;
    }
    if (!this.appearance) {
      this.appearance = DEFAULT_APPEARANCE;
    }
  }

  ngAfterContentInit() {
    this._renderer.addClass(this._input._hostElement, this.classes.inputNative);
    this._input.stateChanges.subscribe(() => {
      this._updateFloatingLabel();
      this._markForCheck();
    });

    const ngControl = this._input.ngControl;

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

  private _updateFielset(el: Element, dir: DirAlias) {
    const { width } = el.getBoundingClientRect();
    const newClass = this._theme.addStyle(`fieldLegendstyle.margin${dir}:${width}`, () => ({
      [`& .${this.classes.fieldsetSpan}, & .${this.classes.hint}`]: {
        [`margin-${dir}`]: `${width}px`
      }
    }), null, null, STYLE_PRIORITY);
    if (dir === DirAlias.start) {
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
    if (this._input.placeholder && !this._labelChild) {
      return true;
    } else if (this._labelChild || this._placeholderChild) {
      return true;
    }
    return false;
  }

  /** @ignore */
  _isPlaceholder() {
    if ((this._labelChild && this._input.placeholder) || (this._labelChild && this._placeholderChild)) {
      return true;
    }
    return false;
  }

  /** @ignore */
  _isEmpty() {
    const val = this._input.value;
    return val === '' || val === null || val === undefined;
  }

  private _updateFloatingLabel() {
    if (this._labelContainer2) {
      const isFloating = this._input.focused || !this._isEmpty() || this.floatingLabel;
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
    if (this._input.focused) {
      this._renderer.addClass(this._el.nativeElement, this.classes.focused);
    } else {
      this._renderer.removeClass(this._el.nativeElement, this.classes.focused);
    }
  }

  private _markForCheck() {
    this._cd.markForCheck();
  }

}
