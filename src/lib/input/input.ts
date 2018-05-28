import { Subscriber ,  Subject ,  BehaviorSubject ,  Subscription } from 'rxjs';
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
  AfterViewInit,
  ModuleWithProviders,
  AfterContentInit,
  Self,
  Optional,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroupDirective,
  NgControl, NgForm,
} from '@angular/forms';
import { LyCommonModule, IsBoolean, toBoolean, LyBgColorAndRaised } from '@alyle/ui';
import { LyInputContents } from './input-contents';
import { LyFieldDirective } from './ly-field.directive';
import { LyTheme2 } from '@alyle/ui';
import { InputService } from './input.service';

@Directive({
  selector: 'ly-default, ly-before, ly-after, ly-input ly-error, ly-input ly-hint'
})
export class LyInputCommon {}

@Directive({
  selector: 'ly-placeholder'
})
export class LyPlaceholder {}

@Directive({
  selector: 'ly-default'
})
export class LyDefault {}

@Directive({
  selector: 'ly-label'
})
export class LyLabel {}


@Component({
  selector: 'ly-text-field, ly-input, ly-textarea',
  styleUrls: ['input.scss'],
  templateUrl: 'input.component.html',
  // tslint:disable-next-line:use-host-property-decorator
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyInput implements OnInit, AfterContentInit, OnChanges, OnDestroy {
  _value: any;
  _elementType: 'input' | 'textarea';
  _inputColor = 'primary';
  currentValue: any;
  private paletteSubscription: Subscription;
  private changed = new Array<(value: any) => void>();
  private touched = new Array<() => void>();
  @ContentChild(LyFieldDirective) _field: LyFieldDirective;
  @ContentChild(LyPlaceholder) lyPlaceholder: LyPlaceholder;
  @ContentChild(LyDefault) lyDefault: LyDefault;
  @ContentChild(LyLabel) lyLabel: LyLabel;
  @Input() type = 'text';
  @Input() label: string;
  @Input() placeholder: string;
  @Input() @IsBoolean() labelAbove: boolean;
  @Input() default: string;
  _errorState: boolean;
  placeholderContainer: any;
  labelContainer: any;
  focusStateSuscription: Subscription;
  _classes: {
    caretColor?: string,
    withColor?: string
  } = {};
  _withColor: string;
  @Input()
  set withColor(val: string) {
    this._withColor = val;
    this.updateColor(val);
  }
  get withColor() {
    return this._withColor;
  }
  @HostBinding('class.ly-label-above')
  get isFloatingLabel(): boolean {
    return this.currentValueState || this.labelAbove || this.isDefault || this.focusState;
  }

  get placeholderState() {
    return !this.currentValueState && this.focusState || !this.currentValueState && !this.focusState && this.isFloatingLabel;
  }
  @HostBinding('class.ly-focus-active') focusState: boolean;
  @HostBinding('class.ly-hidden-input')
  get defaultOff(): boolean {
    return this.currentValue === this.default && !this.focusState || !this.currentValueState && !this.focusState;
  }

  @Input() get disabled(): boolean { return this._field.disabled; }

  @Input() get required(): boolean { return this._field.required; }

  @HostBinding('class.ly-value-on')
  get currentValueState(): boolean {
    return (`${this.currentValue}`).length !== 0 && this.currentValue != null;
  }

  _valueBoolean(val) {
    return !(val === null || val === undefined || val === false || val === '');
  }

  _isErrorState(): boolean {
    if (this._field) {
      return this._field._ngControl.invalid && this._field._ngControl.touched || this._errorState;
    }
  }
  private updateError() {
    this._errorState = this._field._ngControl.invalid;
  }

  value() {
    return this.currentValue;
  }

  constructor(
    private theme: LyTheme2,
    private _changeDetectorRef: ChangeDetectorRef,
    private inputService: InputService,
    @Optional() bcr: LyBgColorAndRaised,
    renderer: Renderer2,
    elementRef: ElementRef
  ) { }

  private updateColor(val: string) {
    const inputColor = () => this.theme.colorOf(val);
    this._classes.caretColor = this.theme.setUpStyle(
      `input:caret${val}`, {
        '': () => (
          `caret-color:${inputColor()}`
        )
      }
    );
    this._classes.withColor = this.theme.setUpStyle(
      `input:${val}`, {
        '': () => (
          `color:${inputColor()};` +
          `background-color:${this.theme.config.input.underline};`
        )
      }
    );
  }

  toBoolean(val: any) {
    return toBoolean(val);
  }
  get isPlaceholder(): boolean {
    return toBoolean(this.placeholder) || !!this.lyPlaceholder;
  }
  get isDefault(): boolean {
    return toBoolean(this.default) || !!this.lyDefault;
  }
  get isLabel(): boolean {
    return toBoolean(this.label) || !!this.lyLabel;
  }

  ngOnInit() {
    if (!this.withColor) {
      this.updateColor(this.theme.config.input.withColor);
    }
    // this._inputColor = this.theme.colorOf(this._color);
    this.focusStateSuscription = this._field.focusState.subscribe((fState: boolean) => {
      this.focusState = fState;
    });
    if (this._field._parent()) {
      this._field._parent().ngSubmit.subscribe((submit) => {
        this.updateError();
      });
    }
  }
  ngAfterContentInit() {
    if (this._field) {
      this.currentValue = this._field._ngControl.value;
      if (this._field._ngControl && this._field._ngControl.valueChanges) {
        this._field._ngControl.valueChanges.subscribe((val: any) => {
          this.currentValue = val;
          this._errorState = false;
          this._changeDetectorRef.markForCheck();
          /**
           * reset error of submit to false
           */
        });
      }
      this._field.focusState.subscribe((isFocused: boolean) => {
        if (this.isDefault) {
          if (!this.currentValueState) {
            this.currentValue = this.default;
            this._field._ngControl.valueAccessor.writeValue(this.default);
            this._field._ngControl.viewToModelUpdate(this.default);
          }
        }
        this._field.markForCheck();
        this._changeDetectorRef.markForCheck();
      });
    } else {
      console.warn('LyInput: Require input native');
    }
  }

  _shouldForward(prop: string): boolean {
    const control = this._field ? this._field._ngControl : null;
    return control && (control as any)[prop];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.default) {
      if (this.isDefault && !this.currentValueState) {
        this.currentValue = this.default;
        this._field._ngControl.viewToModelUpdate(this.default);
      }
    }
  }
  ngOnDestroy() {
    this.focusStateSuscription.unsubscribe();
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, LyCommonModule],
  exports: [LyInput, LyInputContents, LyFieldDirective, LyInputCommon, LyDefault, LyLabel, LyPlaceholder],
  declarations: [LyInput, LyInputContents, LyFieldDirective, LyInputCommon, LyDefault, LyLabel, LyPlaceholder],
})
export class LyInputModule {}
