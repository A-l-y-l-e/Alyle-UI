import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Output,
  Directive,
  SimpleChange,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ContentChild,
  ModuleWithProviders,
  AfterContentInit,
  Self,
  Optional,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroupDirective,
  NgControl, NgForm,
} from '@angular/forms';
import { LyCoreModule } from 'alyle-ui/core';
import { Subscription } from 'rxjs/Subscription';
import { LyInputContents } from './input-contents';
import { LyFieldDirective } from './ly-field.directive';
export * from './input-contents';
import {
  LyTheme,
  ThemeColor,
  themeProperty,
  LyStyleTheme } from 'alyle-ui/core';

@Directive({
  selector: 'ly-input ly-hint'
})
export class LyHint {}

@Directive({
  selector: 'ly-input ly-error'
})
export class LyError {}

@Directive({
  selector: 'ly-before'
})
export class LyInputBefore {}

@Directive({
  selector: 'ly-after'
})
export class LyInputAfter {}

@Component({
  selector: 'ly-input, ly-textarea',
  styleUrls: ['input.scss'],
  templateUrl: 'input.component.html',
  host: {
    '[class.ly-input-invalid]': '_isErrorState()',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyInput implements OnInit, AfterContentInit, OnChanges {
  _value: any = '';
  _elementType: 'input' | 'textarea';
  _color = 'primary';
  public _valState: boolean;
  currentValue: any;
  private _disabled = false;
  private _focused = false;
  private _floatinglabel = false;
  private _autofocus = false;
  // floating Label state boolean
  private _floatinglabelBoolean = false;
  // @ViewChild('input') _inputElement: ElementRef;
  private changed = new Array<(value: any) => void>();
  private touched = new Array<() => void>();
  _inputState = new BehaviorSubject<boolean>(true);
  @ContentChild(LyFieldDirective) _field: LyFieldDirective;

  @Input() type = 'text';
  get placeholder(): string {
    return this._field ? this._field.placeholder : '';
  }
  get floatLabel(): string {
    return this._field ? this._field.floatLabel : null;
  }
  @Input('floatLabel') floatlabel: string;
  @Input('isFloatLabel') isFloatLabel: boolean;
  @Input() cols: string;
  @Input() rows: string;
  @Input() default: string;
  @Input()
  get autofocus(): boolean { return this._autofocus; }
  set autofocus(value) {
    if (value) {
      this._autofocus = !!value;
    } else {
      this._autofocus = true;
    }
  }

  /**
   * inputColor
   */
  @Input('inputColor')
  set color(val: string) {
    this._color = val;
  }
  get color() {
    return this._color;
  }

  @Input()
  get disabled(): boolean { return this._field.disabled; }
  // set disabled(value) { this._disabled = coerceBooleanProperty(value); }

  @Input()
  get required(): boolean { return this._field.required; }

  get _floatlabel() {
    // if (!this._floatinglabel) {
    //   this._floatinglabelBoolean = coerceBooleanProperty(this._value);
    //   return this._floatinglabelBoolean;
    // }
    return this.floatLabel;
  }
  _valueBoolean(val) {
    return !(val === null || val === undefined || val === false || val === '');
  }

  get floatingLabel(): boolean { return this._floatinglabel; }
  @Input()
  set floatingLabel(v: boolean) {
    if (v === true) {
      this._floatinglabelBoolean = true;
      this._floatinglabel = v;
    }
  }
  _isErrorState(): boolean {
    if (this._field)
    return this._field._ngControl.invalid && this._field._ngControl.touched;
  }

  get focused() { return this._focused; }

  _handleFocus() {
    this._focused = true;
    this._floatinglabelBoolean = true;
    if (this.default && this.currentValue === this.default) {
      this._field.elementRef.nativeElement.value = this.default;
      this._inputState.next(false);
    }
  }

  _handleBlur() {
    this._focused = false;
    if (this._floatinglabel) {
      this._floatinglabelBoolean = true;
    } else {
      this._floatinglabelBoolean = (!!this.value());
    }
    if (this.default && this.currentValue === this.default) {
      this._field.elementRef.nativeElement.value = null;
      this._inputState.next(true);
    }
  }

  value() {
    return this.currentValue;
  }

  _hasFloatlabel(): boolean {
    return !!this.floatLabel;
  }
  _hasPlaceHolder(): boolean {
    return !!this.placeholder;
  }

  constructor(
    elementRef: ElementRef,
    private theme: LyTheme,
    private styleTheme: LyStyleTheme,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this._elementType = elementRef.nativeElement.nodeName.toLowerCase() === 'ly-input' ?
        'input' :
        'textarea';
  }

  ngOnInit() {
    // this._field._ngControl.valueChanges.subscribe((val) => {
    //   console.log('value change', val);
    // });
  }
  ngAfterContentInit() {
    if (this._field) {
      this._field.focusState.subscribe((isFocused: boolean) => {
        if (isFocused) {
          this._handleFocus();
        } else {
          this._handleBlur();
        }
        this._changeDetectorRef.markForCheck();
      });
      if (this._field.floatLabel && this.default) {
        this.isFloatLabel = true;
      }
      if (this._field._ngControl && this._field._ngControl.valueChanges) {
        this._field._ngControl.valueChanges.subscribe((val: any) => {
          this.currentValue = val;
          if (this.default && !this._valueBoolean(val)) {
            this._field._ngControl.viewToModelUpdate(this.default);
            this.currentValue = this.default;
          }
          this._valState = !!val;
          this._floatinglabelBoolean = (val === '' ? true : !!val);
          this._changeDetectorRef.markForCheck();
          this._field.markForCheck();
        });
      }
    } else {
      console.warn('LyInput: Require input native');
    }
  }

  _shouldForward(prop: string): boolean {
    const control = this._field ? this._field._ngControl : null;
    return control && (control as any)[prop];
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }
  ngOnDestroy() {
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, LyCoreModule],
  exports: [LyInput, LyInputContents, LyInputBefore, LyInputAfter, LyFieldDirective, LyHint, LyError],
  declarations: [LyInput, LyInputContents, LyInputBefore, LyInputAfter, LyFieldDirective, LyHint, LyError],
})
export class LyInputModule {}
