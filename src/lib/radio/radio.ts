import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Directive,
  Output,
  SimpleChange,
  ChangeDetectorRef,
  OnChanges,
  ModuleWithProviders,
  AfterContentInit,
  OnInit,
  ContentChildren,
  QueryList,
  Optional,
  HostBinding,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  NgZone
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { LyCoreModule } from 'alyle-ui/core';
import { RandomId, Ly_Next, Ly_Prev } from 'alyle-ui/core';
import { LyRippleModule } from 'alyle-ui/ripple';
import { Subscription } from 'rxjs/Subscription';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LyTheme, themeProperty, LyStyleTheme, BgAndColorStyle } from 'alyle-ui/core';
export const LY_RADIO_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyRadioGroup),
  multi: true
};

@Component({
  selector: 'ly-radio-group',
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
    }
  `],
  template: `<ng-content></ng-content>`,
  providers: [LY_RADIO_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyRadioGroup implements AfterContentInit, ControlValueAccessor {
  _value: any = null;
  index = 0;
  name = `ly-radio-name-${this.randomId.generate}`;
  _color = 'accent';
  private _colorTxt: string;

  private innerValue: any;

  @Input('radioColor')
  set color(val: string) {
    this._color = val;
    if (this._radios) {
      this._radios.forEach((radio: LyRadio) => {
        radio._markForCheck();
      });
    }
  }
  get color() {
    return this._color;
  }

  private changed = new Array<(value: any) => void>();
  private touched = new Array<() => void>();

  touch() {
    this.touched.forEach(f => f());
  }

  registerOnChange(fn: (value: any) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized = false;


  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void;

  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void;


  @ContentChildren(forwardRef(() => LyRadio)) _radios: QueryList<LyRadio>;
  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach(radio => {
        radio.name = this.name;
      });
    }
  }

  get value(): any { return this._value; };
  @Input() set value(v: any) {
    if (v !== this._value) {
      this._value = v;
    }
  }

  constructor(
    private elementRef: ElementRef,
    private randomId: RandomId,
    public theme: LyTheme,
    public styleTheme: LyStyleTheme,
    public ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this._colorTxt = 'colorText';
  }
  unSelectAll() {
    if (!!this._radios) {
      this._radios.forEach(radio => {
        radio.checked = false;
      });
    }
  }

  private _ix = 0;

  next() {
    this.unSelectAll();
    const _radio = Ly_Next(this._radios, this.index);
    this.index = _radio.index;
    this._radios.forEach((radio, inx) => {
      if (inx == _radio.index) {
        radio.checked = true;
      }
    });
  }
  writeValue(value: any) {
    this._value = value;
    let _radio: any;
  }
  ngAfterContentInit() {

  }
  updatevalue(value: any) {
    this._value = value;
    this.changed.forEach(f => f(value));
  }

  ngAfterViewInit() {
    this._isInitialized = true;
    this._radios.changes.subscribe((radios: LyRadioGroup) => {
      // TODO: update in changes *** Important! for support ngFor
    });
    this._radios.forEach((radio: LyRadio, index) => {
      if (radio.checked) {
        if (this._ix == 0) {
          this._ix = 1;
          // setTimeout(() => {
          //   // this._value = radio.value;
          //   // this._onChangeCallback(this._value);
          // }, 0);
        } else {
          // this._value = radio.value;
          // this._onChangeCallback(this._value);
        }
      }
    });
  }
  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
@Component({
  selector: 'ly-radio',
  styleUrls: ['radio.scss'],
  template: `
    <label [color]="radioGroup.color" [attr.for]="inputId" class="ly-radio-label">
      <input
        class="ly-radio-input"
        [class.ly-radio-checked]="checked"
        [id]="inputId"
        [checked]="checked"
        [name]="name"
        (change)="_onInputChange($event)"
        type="radio">
      <div #_ripple class="ly-radio-container" [ly-ripple-max-radius]="24" ly-ripple [ly-ripple-centered]="true" ly-ripple-sensitive>
        <div class="ly-radio-outer-circle" color="colorText"></div>
        <div class="ly-radio-inner-circle"></div>
      </div>
      <div
      (mousedown)="_ripple._handleMouseDown($event)"
      (mouseup)="_ripple._handleMouseup($event)"
      (mouseleave)="_ripple._handleMouseup($event)"
      class="ly-radio-label-content"
      color="colorText">
        <ng-content></ng-content>
      </div>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyRadio implements OnInit, OnChanges {
  id = `ly-radio-${this.randomId.generate}`;
  name = '';
  _colorTxt = '';
  _value: any = null;
  private _checked = false;


  get inputId(): string {
    return `${this.id}-input`;
  }

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value != value) {
      this._value = value;
    }
  }
  _onInputChange(event: any) {
    this.radioGroup.unSelectAll();
    this.checked = true;
    this.radioGroup.updatevalue(this._value);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['checked']) {
      Promise.resolve(null).then(() => this.radioGroup.updatevalue(this._value));
    }
  }

  @HostBinding('class.ly-radio-checked')
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(newCheckedState: boolean) {
    if (newCheckedState) {
      this._checked = newCheckedState;
      // this.radioGroup.value = this._value;

      this.onCheckedState.emit(true);

    }
  }
  @Output() onCheckedState = new EventEmitter<boolean>();
  radioGroup: LyRadioGroup;
  ngOnInit() {
    if (this.radioGroup) {
      // If the radio is inside a radio group, determine if it should be checked
      // this.checked = this.radioGroup.value === this._value;
      // Copy name from parent radio group
      this.name = this.radioGroup.name;
      if (this.radioGroup) {
      }
    }
  }
  ngAfterViewChecked() {

  }
  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }


  constructor(
    @Optional() radioGroup: LyRadioGroup,
    private randomId: RandomId,
    public theme: LyTheme,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.radioGroup = radioGroup;
    this._colorTxt = this.theme.AlyleUI.palette.primary.text;

  }
}

@NgModule({
  imports: [CommonModule, FormsModule, LyRippleModule, LyCoreModule],
  exports: [LyRadioGroup, LyRadio],
  declarations: [LyRadioGroup, LyRadio],
})
export class LyRadioModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: LyRadioModule};
  }

}
