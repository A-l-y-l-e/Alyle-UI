import {
  Component,
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
  NgZone,
  ViewChild,
  ElementRef
} from '@angular/core';
import { LyRippleModule, LyRipple, LyRippleService, Ripple } from '@alyle/ui/ripple';
import { Subscription , Subject , BehaviorSubject , Observable } from 'rxjs';
import {
  NgModel,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LyTheme, LyCommonModule, Platform, IsBoolean } from '@alyle/ui';
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
      display: inline-flex;
    }
  `],
  template: `<ng-content></ng-content>`,
  providers: [LY_RADIO_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyRadioGroup implements AfterContentInit, AfterViewInit, ControlValueAccessor {
  _value = null;
  name = `ly-radio-name-${idx++}`;
  _color = 'accent';

  @Input() value = null;
  @Input() radioColor = 'accent';
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


  constructor(
    private elementRef: ElementRef,
    public theme: LyTheme,
    public ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
  }

  writeValue(value: any) {
    this._value = value;
  }

  ngAfterContentInit() {

  }
  updatevalue(value: any) {
    this._value = value;
    this.changed.forEach(f => f(value));
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    /**set value null if all checked === false */
    Promise.resolve(null).then(() => {
      const stateChecked = this._radios.find((radio: LyRadio, index) => radio.checked);
        if (!stateChecked) {
          this.updatevalue(null);
          this.markForCheck();
        }
    });
  }

}
@Component({
  selector: 'ly-radio',
  styleUrls: ['radio.scss'],
  template: `
  <label #_labelContainer [attr.for]="inputId" class="ly-radio-label">
    <input
      class="ly-radio-input"
      [class.ly-radio-checked]="checked"
      [id]="inputId"
      [checked]="checked"
      [name]="name"
      (change)="_onInputChange($event)"
      type="radio"
      >
    <div #_radioContainer [color]="radioGroup.radioColor" class="ly-radio-container">
      <div class="ly-radio-icon-container">
      <div class="ly-radio-outer-circle" color="radio:radioOuterCircle"></div>
      <div class="ly-radio-inner-circle"></div>
      </div>
    </div>
    <div
    class="ly-radio-label-content">
      <ng-content></ng-content>
    </div>
  </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyRadio implements OnInit, OnChanges, OnDestroy {
  id = `ly-radio-id-${idx++}`;
  name = '';
  _value = null;
  private _rippleContainer: Ripple;
  private _checked = false;
  @ViewChild('_radioContainer') private _radioContainer: ElementRef;
  @ViewChild('_labelContainer') _labelContainer: ElementRef;
  @Output() onCheckedState = new EventEmitter<boolean>();
  @HostBinding('class.ly-radio-checked') @Input() @IsBoolean() checked: boolean;
  get inputId(): string {
    return `${this.id}-input`;
  }

  @Input() value: any;

  _onInputChange(event: any) {
    this.radioGroup.updatevalue(this.value);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['checked']) {
      if (this.checked) {
        Promise.resolve(null).then(() => {
          this.radioGroup.updatevalue(this.value);
        });
      }
    }
  }

  ngOnInit() {
    if (this.radioGroup) {
      // Copy name from parent radio group
      this.name = this.radioGroup.name;
    }
    this._rippleContainer = new Ripple(this.ngZone, this._rippleService.stylesData, this._radioContainer.nativeElement, this._elementRef.nativeElement);
    this._rippleContainer.setConfig({
      centered: true,
      radius: 'containerSize'
    });
  }
  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this._rippleContainer.removeEvents();
  }


  constructor(
    @Optional() public radioGroup: LyRadioGroup,
    private _elementRef: ElementRef,
    public theme: LyTheme,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private _rippleService: LyRippleService
  ) { }
}

@NgModule({
  imports: [CommonModule, FormsModule, LyRippleModule, LyCommonModule],
  exports: [LyRadioGroup, LyRadio],
  declarations: [LyRadioGroup, LyRadio],
})
export class LyRadioModule { }
