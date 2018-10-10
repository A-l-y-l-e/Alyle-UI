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
  ViewEncapsulation
  } from '@angular/core';
import { LY_COMMON_STYLES, LyTheme2, ThemeVariables, mergeDeep } from '@alyle/ui';
import { LyInputNative } from './input';
import { LyLabel } from './label';
import { LyPlaceholder } from './placeholder';

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
      paddingTop: '1em',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    labelContainer: {
      ...LY_COMMON_STYLES.fill,
      pointerEvents: 'none',
      display: 'flex',
      width: '100%',
      '& > div': {
        color: theme.input.borderColor
      }
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
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: theme.input.label,
      transition: `${theme.animations.curves.deceleration} .${theme.animations.durations.complex}s`
    },
    labelFloating: {
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
  @ViewChild('_labelContainer') _labelContainer: ElementRef<HTMLDivElement>;
  @ContentChild(LyInputNative) _input: LyInputNative;
  @ContentChild(LyPlaceholder) _placeholderChild: LyPlaceholder;
  @ContentChild(LyLabel) _labelChild: LyLabel;
  @Input()
  set withColor(val: string) {
    if (val !== this._withColor) {
      this._withColor = val;
      this._withColorClass = this._theme.addStyle(`ly-field.withColor:${val}`, (theme: ThemeVariables) => {
        const color = theme.colorOf(val);
        return {
          [`&.${this.classes.focused} .${this.classes.labelFloating} .${this.classes.label}`]: {
            color
          },
          [`&.${this.classes.focused} .${this.classes.labelContainer}`]: {
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
            ...appearance.input,
            ...appearance.placeholder
          },
          [`& .${this.classes.label}`]: {
            ...appearance.label
          },
          [`& .${this.classes.container}:hover .${this.classes.labelContainer} > div`]: {
            ...appearance.containerLabelHover
          },
          [`& .${this.classes.labelContainer} > div`]: {
            ...appearance.containerLabel,
            position: 'relative'
          },
          [`& .${this.classes.labelFloating} .${this.classes.label}`]: appearance.labelFloating,
          [`& .${this.classes.labelFloating}`]: appearance.containerLabelCenterFloating,
          [`& .${this.classes.labelSpacingStart}`]: {
            ...appearance.containerLabelStart
          },
          [`& .${this.classes.labelCenter}`]: {
            ...appearance.containerLabelCenter
          },
          [`& .${this.classes.labelSpacingEnd}`]: {
            ...appearance.containerLabelEnd
          },
          [`&.${this.classes.focused} .${this.classes.labelContainer} > div`]: {
            ...appearance.containerLabelFocused
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
    private _theme: LyTheme2,
    private _cd: ChangeDetectorRef
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
    const isFloating = this._input.focused || !this._isEmpty();
    if (this._isFloating !== isFloating) {
      this._isFloating = isFloating;
      if (isFloating) {
        this._renderer.addClass(this._labelContainer.nativeElement, this.classes.labelFloating);
      } else {
        this._renderer.removeClass(this._labelContainer.nativeElement, this.classes.labelFloating);
      }
    }
  }

  private _markForCheck() {
    this._cd.markForCheck();
  }

}
