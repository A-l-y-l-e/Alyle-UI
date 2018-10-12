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
  NgZone
  } from '@angular/core';
import { LY_COMMON_STYLES, LyTheme2, ThemeVariables, mergeDeep, ElementObserver, Platform, toBoolean } from '@alyle/ui';
import { LyInputNative } from './input';
import { LyLabel } from './label';
import { LyPlaceholder } from './placeholder';
import { LyHint } from './hint';
import { LyPrefix } from './prefix';
import { LySuffix } from './suffix';

const STYLE_PRIORITY = -2;
const DEFAULT_APPEARANCE = 'standard';
const DEFAULT_WITH_COLOR = 'primary';
const styles = (theme: ThemeVariables) => {
  return {
    root: {
      display: 'inline-block',
      position: 'relative',
      marginBottom: '1em'
    },
    container: {
      height: '100%',
      display: 'flex',
      alignItems: 'baseline',
      '&:after': {
        ...LY_COMMON_STYLES.fill,
        content: `\'\'`,
        pointerEvents: 'none',
        borderColor: theme.input.borderColor
      }
    },
    fix: {
      // paddingTop: '1em',
      position: 'relative',
      '&:before': {
        content: `\'\'`,
        pointerEvents: 'none',
        ...LY_COMMON_STYLES.fill
      }
    },
    labelContainer: {
      ...LY_COMMON_STYLES.fill,
      pointerEvents: 'none',
      display: 'flex',
      width: '100%',
      borderColor: theme.input.borderColor
    },
    fieldset: {
      margin: 0,
      borderStyle: 'solid',
      borderColor: theme.input.borderColor
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
      color: theme.input.label,
      width: '100%',
      transition: `${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s`
    },
    floatingLabel: {
      fontSize: '75%'
    },
    placeholder: {
      ...LY_COMMON_STYLES.fill,
      pointerEvents: 'none',
      color: theme.input.label
    },
    focused: {},
    hint: {},
    inputNative: {
      resize: 'vertical',
      padding: 0,
      outline: 'none',
      border: 'none',
      backgroundColor: 'transparent',
      color: 'inherit',
      font: 'inherit',
      alignSelf: 'stretch'
    }
  };
};

@Component({
  selector: 'ly-field',
  templateUrl: 'field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LyField implements OnInit, AfterContentInit, AfterViewInit {
  /**
   * styles
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, 'ly-field', STYLE_PRIORITY);
  protected _appearance: string;
  protected _appearanceClass: string;
  protected _withColor: string;
  protected _withColorClass: string;
  protected _isFloating: boolean;
  protected _floatingLabel: boolean;
  @ViewChild('_labelContainer') _labelContainer: ElementRef<HTMLDivElement>;
  @ViewChild('_labelContainer2') _labelContainer2: ElementRef<HTMLDivElement>;
  @ViewChild('_prefixContainer') _prefixContainer: ElementRef<HTMLDivElement>;
  @ContentChild(LyInputNative) _input: LyInputNative;
  @ContentChild(LyPlaceholder) _placeholderChild: LyPlaceholder;
  @ContentChild(LyLabel) _labelChild: LyLabel;
  @ContentChildren(LyHint) _hintChildren: QueryList<LyHint>;
  @ContentChildren(LyPrefix) _prefixChildren: QueryList<LyPrefix>;
  @ContentChildren(LySuffix) _suffixChildren: QueryList<LySuffix>;
  @Input()
  set floatingLabel(val: boolean) {
    this._floatingLabel = toBoolean(val);
    this._updateFloatingLabel();
  }
  get floatingLabel() {
    return this._floatingLabel;
  }
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

  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      if (!(this._theme.config.input as any).appearance[val])  {
        throw new Error(`${val} not found in theme.input.appearance`);
      }
      this._appearanceClass = this._theme.addStyle(`ly-field.appearance:${val}`, (theme: ThemeVariables) => {
        const appearance = mergeDeep({}, theme.input.appearance.any, theme.input.appearance[val]);
        return {
          [`& .${this.classes.container}`]: appearance.container,
          [`& .${this.classes.inputNative}`]: appearance.input,
          [`& .${this.classes.placeholder}`]: {
            ...appearance.placeholder
          },
          [`& .${this.classes.label}`]: {
            ...appearance.label
          },
          [`& .${this.classes.labelContainer}`]: {
            ...appearance.containerLabel
          },
          [`& .${this.classes.floatingLabel}.${this.classes.label}`]: appearance.floatingLabel,
          [`& .${this.classes.floatingLabel}`]: appearance.containerLabelCenterFloating,
          [`& .${this.classes.labelSpacingStart}`]: {
            ...appearance.containerLabelStart
          },
          [`& .${this.classes.labelCenter}`]: {
            ...appearance.containerLabelCenter
          },
          [`& .${this.classes.labelSpacingEnd}`]: {
            ...appearance.containerLabelEnd
          },
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
    _renderer.addClass(_el.nativeElement, this.classes.root);
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
    if (Platform.isBrowser && this._prefixContainer && (this._prefixChildren || this._suffixChildren)) {
      this._ngZone.runOutsideAngular(() => {
        const el = this._prefixContainer.nativeElement;
        this._elementObserver.observe(el, (mutationRecord) => {
          console.log(mutationRecord);
          console.log(el.getBoundingClientRect().width);
        });
      });
    }
    this._input.valueChanges.subscribe(() => {
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
    if (this._input.focused) {
      this._renderer.addClass(this._el.nativeElement, this.classes.focused);
    } else {
      this._renderer.removeClass(this._el.nativeElement, this.classes.focused);
    }
    if (this._labelContainer2) {
      const isFloating = this._input.focused || !this._isEmpty() || this.floatingLabel;
      if (this._isFloating !== isFloating) {
        this._isFloating = isFloating;
        if (isFloating) {
          this._renderer.addClass(this._labelContainer2.nativeElement, this.classes.floatingLabel);
        } else {
          this._renderer.removeClass(this._labelContainer2.nativeElement, this.classes.floatingLabel);
        }
      }
    }
  }

  private _markForCheck() {
    this._cd.markForCheck();
  }

}
