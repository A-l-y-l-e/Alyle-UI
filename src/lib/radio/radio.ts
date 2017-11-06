import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
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
  AfterViewInit,
  OnInit,
  OnDestroy,
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
import { Ly_Next, Ly_Prev } from 'alyle-ui/core';
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
let idx = 0;
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
export class LyRadioGroup implements AfterContentInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  _value: any = null;
  index = 0;
  name = `ly-radio-name-${idx++}`;
  _color = 'accent';
  _currentValue: BehaviorSubject<any> = new BehaviorSubject(null);
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
  @ContentChildren(forwardRef(() => LyRadio)) _radios: QueryList<LyRadio>;

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

  get value(): any { return this._value; }
  @Input() set value(v: any) {
    if (v !== this._value) {
      this._value = v;
    }
  }

  constructor(
    private elementRef: ElementRef,
    public theme: LyTheme,
    public styleTheme: LyStyleTheme,
    public ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this._colorTxt = 'colorText';
  }

   writeValue(value: any) {
    this._value = value;
    this._currentValue.next(value);
  }
  ngAfterContentInit() {

  }
  updatevalue(value: any) {
    this._value = value;
    this.changed.forEach(f => f(value));
  }

  ngAfterViewInit() {
    this._radios.changes.subscribe((radios: LyRadioGroup) => {
      // TODO: update in changes *** Important! for support ngFor
    });
    this._radios.forEach((radio: LyRadio, index) => {
      /** code */
    });
  }

  ngOnDestroy() {
    this._currentValue.complete();
  }

}
@Component({
  selector: 'ly-radio',
  styleUrls: ['radio.scss'],
  template: `
    <label [color]="radioGroup.color" [attr.for]="inputId" class="ly-radio-label">
      <input
        class="ly-radio-input"
        [class.ly-radio-checked]="(_currentValue | async) === (radioGroup._currentValue | async)"
        [id]="inputId"
        [checked]="(_currentValue | async) === (radioGroup._currentValue | async)"
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
  id = `ly-radio-${idx++}`;
  name = '';
  _colorTxt = '';
  _value: any = null;
  private _checked = false;
  @Output() onCheckedState = new EventEmitter<boolean>();
  radioGroup: LyRadioGroup;
  _currentValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  get inputId(): string {
    return `${this.id}-input`;
  }

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this._currentValue.next(value);
    }
  }
  _onInputChange(event: any) {
    this.radioGroup._currentValue.next(this.value);
    this.radioGroup.updatevalue(this.value);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['checked']) {
      Promise.resolve(null).then(() => {
        this.radioGroup._currentValue.next(this.value);
        this.radioGroup.updatevalue(this.value);
      });
    }
  }

  @HostBinding('class.ly-radio-checked')
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(newCheckedState: boolean) {
    this._checked = newCheckedState;
    this.onCheckedState.emit(true);
  }
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
  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }


  constructor(
    @Optional() radioGroup: LyRadioGroup,
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
