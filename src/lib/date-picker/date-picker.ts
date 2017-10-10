import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Output,
  SimpleChange,
  OnChanges,
  AfterContentInit,
  EventEmitter,
  ModuleWithProviders,
  ViewChild,
  ViewContainerRef,
  ViewChildren,
  QueryList,
  NgZone,
  TemplateRef,
  Directive,
  HostListener,
  HostBinding,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import { LyRippleModule } from 'alyle-ui/ripple';
import { LyButtonModule } from 'alyle-ui/button';
import { LyShadowModule } from 'alyle-ui/shadow';
import {
    RandomId, LyPalette
} from 'alyle-ui/core';
import { hoverDay } from './date-picker-animations';
export * from './date-picker-animations';
export * from './date-picker-content';
import { LyDatePickerContent } from './date-picker-content';
import {
  LyTheme,
  themeProperty,
  BgAndColorStyle,
  LyStyleTheme }        from 'alyle-ui/core';

const noop = () => {};

export const LY_PICKER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePicker),
  multi: true
};

@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-years',
  template: `
  <ng-content></ng-content>
  `,
})
export class YearPicker {
  private _year: number;
  private _state: boolean = false;
  @Input()
  get year() {
    return this._year;
  }
  set year(year) {
    this._year = year;
    if (this._state) {
      this.open.emit();
    }
  }
  @Output() open: EventEmitter<string> = new EventEmitter<string>();
  constructor() {

  }
  ngAfterContentInit() {
    this._state = true;
    this.open.emit();
  }
}
@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-date-picker-icon',
  styles: [`
    :host {
      align-items: center;
      width: 24px;
      height: 100%;
      display: inline-block;
      cursor: pointer;
    }
    .ly-date-picker-icon {
      height: 24px;
      width: 24px;
    }
    `
  ],
  template: `
  <div [ly-ripple-max-radius]="24" ly-ripple [ly-ripple-centered]="true" class="ly-date-picker-icon">
    <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  </div>
  `,
})
export class LyButtonDatePicker {

  constructor(

  ) {
  }
}
@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-date-picker',
  styleUrls: ['date-picker.css'],
  templateUrl: 'date-picker.html',
  providers: [LY_PICKER_CONTROL_VALUE_ACCESSOR],
  animations: [
    hoverDay,
  ],
})
export class DatePicker implements ControlValueAccessor, AfterContentInit, OnChanges, OnInit{
  private _bg: string = 'primary';
  private _color: string = 'rgba(0, 0, 0, 0.60)';
  private _subscription: Subscription;
  @HostBinding('style.background') styleBackground: string;
  @HostBinding('style.color') styleColor: string;
  hover: any = 'sadasd';
  private _dateStart: any;
  private _dateStartSelected: any;
  _dateEnd: any;
  private _dateEndSelected: any;
  _selectMonthState: any = new Date();
  private _selectX: 'start' | 'end' = 'start';
  getYears: any;
  _selectYearState: boolean = false;
  private x_FloatingPicker: boolean = false;
  daysName: Array<string> = [ 'M', 'T', 'W', 'T', 'F', 'S', 'S' ];
  private _isInitialized: boolean = false;
  // @ViewChild(FocusTrap) _focusTrap: FocusTrap;

  ___templateRef: any;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @Input('ly-mode') mode: string;
  _dateFilter: string = 'MM-d-y';
  public floatingPickerState: boolean = false;
  get dpStart() {
    return new Date(this._dateStartSelected);
  }
  get dpEnd() {
    return new Date(this._dateEndSelected);
  }

  @Input()
  set dateStart(v: any) {
    this._dateStartSelected = this.format(v) === true && v === true ? new Date(v) : this._dateStartSelected;
    this._dateStart = this.format(v) === true && v === true ? new Date(v) : this._dateStart;

  }
  get dateStart() {
    return this.datePipe.transform(this._dateStartSelected, this._dateFilter);
  }
  @Output() dateStartChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set dateEnd(v: any) {
    this._dateEndSelected = this.format(v) === true && v === true ? new Date(v) : this._dateEndSelected;
    this._dateEnd = this.format(v) === true && v === true ? new Date(v) : this._dateEnd;
  }
  get dateEnd() {
    return this.datePipe.transform(this._dateEndSelected, this._dateFilter);
  }
  @Output() dateEndChange: EventEmitter<any> = new EventEmitter<any>();

  @Input('ly-date-filter')
  set dateFilter(val: string) {
    this._dateFilter = val;
  }

  @Input('floating-picker')
  set floatingPicker(v: any) {
    this.x_FloatingPicker = v;

  }
  get floatingPicker() {
    return this.x_FloatingPicker;
  }

  public detectTypeSelected() {
    // detect type selected date: simple select or range select
    return !!this._dateEndSelected;
  }
  public ngAfterViewChecked() {
    this.detectTypeSelected();
  }

  template() {
    let tRef: any = this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.___templateRef = tRef;
    return tRef;
  }
  _templateElement(template: any) {
    let tRef: any = this.viewContainerRef.createEmbeddedView(template);
    // this.___templateRef = tRef;
    return tRef;
  }
  show() {
    let body: any = document.querySelector('body');
    let ref: any;
    ref = this.template();
    ref.rootNodes.forEach((root: any) => {
      body.appendChild(root);
    });
  }
  hide() {
    this.floatingPickerState = !true;
    if (this.___templateRef != null) {
      this.___templateRef.destroy();
      this.___templateRef.detach();
    }
    this.___templateRef = null;
  }

  private get _selectedDateNow(): Date {
    return this._dateStart || new Date();
  }

  constructor(
    private elementRef: ElementRef,
    public viewContainerRef: ViewContainerRef,
    private _ngZone: NgZone,
    public palette: LyPalette,
    private datePipe: DatePipe,
    public theme: LyTheme,
    public styleTheme: LyStyleTheme,
  ) {
    this.getMonth = this.days().data;
    this.getYears = this.years();
  }
  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.styleBackground = this.theme.color(this._bg, colors);
      this.styleColor = this.theme.color(this._color, colors);
    });
  }

  format(date: any): any {
    // validate date
    let _date: any = new Date(date);
    let dateFormat: any;
    let fkda = new Date('x');
    dateFormat = String(_date) === String(fkda) ? false : true;
    // console.log(dateFormat, date, _date, fkda);
    return dateFormat;

  }

  ngAfterContentInit() {
    this._isInitialized = true;
    if (this._dateStartSelected != null) {
      this.dateStartChange.emit(this.datePipe.transform(this._dateStartSelected, this._dateFilter));
    }
    if (this._dateEndSelected != null) {
      this.dateEndChange.emit(this.datePipe.transform(this._dateEndSelected, this._dateFilter));
    }
  }
  writeValue(v: any) {
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void = noop;

  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void = noop;

  private years() {
    let numsYears = 30;
    let years: number[] = [];
    let _date: any = new Date(this._selectMonthState);
    let yearNow: any = _date.getFullYear() - numsYears;
    for (let i = 0; i < numsYears * 2; i++) {
      years.push(yearNow + i);
    }
    return years;
  }

  /**
   * Month prev.
   */
  _left() {
    this._selectMonthState = new Date(this.days()._INI.getTime() - 60 * 60 * 24 * 1000);
    this.updateSelectorMonth();
  }

  /**
   * Month next.
   */
  _right() {
    this._selectMonthState = new Date(this.days()._INI.getTime() + (this.days().dateEND + 2) * 60 * 60 * 24 * 1000);
    this.updateSelectorMonth();
  }
  updateSelectorMonth() {
    this.getMonth = this.days().data;
  }
  toggleYears() {
    this._selectYearState = this._selectYearState ? false : true;
  }
  apply() {
    if (this._dateStartSelected != this._dateStart) {
      this._dateStartSelected = new Date(this._dateStart);
      this.dateStartChange.emit(this.datePipe.transform(this._dateStartSelected, this._dateFilter));
    }
    if (this._dateEndSelected != this._dateEnd && this._dateEnd != null) {
      this._dateEndSelected = new Date(this._dateEnd);
      this.dateEndChange.emit(this.datePipe.transform(this._dateEndSelected, this._dateFilter));
      this._selectX = 'start';
    }
    this.updateDatePickerSelector('start');
    this.hide();
  }
  get ChangesDatePicker() {
    return String(this._dateStart) != String(this._dateStartSelected) || String(this._dateEnd) != String(this._dateEndSelected);
  }
  _toString(val: any) {
    return String(val);
  }
  cancel() {
    this._dateStart = this._dateStartSelected;
    this._dateEnd = this._dateEndSelected;
    this.updateDatePickerSelector('start');
    this._selectX = 'start';
    this.hide();
    // this.clearDatePicker();
  }
  clearDatePicker() {
    this._dateStart = null;
    this._dateEnd = null;

  }
  selectDate(date: any) {
    let dateStart: any;
    let dateEnd: any;
    if (this.detectTypeSelected() == false) {
      this._selectX = 'start';
    }
    if (this._dateStart != null && this._dateEnd != null) {
      this.clearDatePicker();
    }
    if (this._selectX == 'start') {
      this._dateStart = new Date(date);
    } else if (this._selectX == 'end') {
      this._dateEnd = new Date(date);
    }
    if (this.formatMMDDYY(this._dateStart).getTime() > this.formatMMDDYY(this._dateEnd).getTime() && this._dateStart != null && this._dateEnd != null) {
      dateStart = this._dateStart;
      dateEnd = this._dateEnd;
      this._dateStart = dateEnd;
      this._dateEnd = dateStart;
    }
    this._selectX = this._selectX == 'start' ? 'end' : 'start';
  }
  public updateDatePickerSelector(state: 'start' | 'end') {
    console.warn('!!this._dateStart', !!this._dateStart, this._dateStart);
    if (!!this._dateStart) {
      console.warn('!!this._dateStart', !!this._dateStart);
      if (state == 'start') {
        this._selectMonthState = new Date(this._dateStart);
      } else if (state == 'end') {
        this._selectMonthState = new Date(this._dateEnd);
      }
      this.updateSelectorMonth();
    }
  }
  formatMMDDYY(date: any) {
    let _date: any = new Date(date);
    let result: any = this.strtotime(`${_date.getMonth() + 1}-${_date.getDate()}-${_date.getFullYear()}`);
    result = new Date(result);
    return result;
  }
  now(): any {
    let date: any = new Date();
    return {
      date: date,
      dateString: this.strtotime(`${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`),
    };
  }
  dateString(date: any) {
    let _date: any = new Date(date);
    return this.strtotime(`${_date.getMonth() + 1}-${_date.getDate()}-${_date.getFullYear()}`);
  }
  strtotime(date: any) {
    return new Date(date).getTime();
  }
  getMonth: any;
  days() {
    let _days: any = {
      data: [],
      _INI: '',
      dateEND: '',
    };
    let dateSelected = new Date(this._selectMonthState);
    let dayNow = (dateSelected.getDate() - 1) * 60 * 60 * 24 * 1000;
    let dateNow = new Date(dateSelected.getTime());
    let dateINI = new Date(dateNow.getTime() - dayNow);
    let dateEND: any;
    let dayLeft = 0;
    if (new Date(dateINI).getDay() == 0) {
      dayLeft = 6;
    } else {
      dayLeft = new Date(dateINI).getDay() - 1;
    }
    for (var i = 0; i < dayLeft; i++) {
      _days.data.push({
        index: ' ',
        date: 0,
      });
    }
    let dateTemp: any;
    for (var _i = 1; _i < 32; _i++) {
      dateTemp = new Date((dateINI.getTime()) + ((_i - 1) * 60 * 60 * 24 * 1000));
      if (_i == dateTemp.getDate()) {
        dateEND = _i;
        _days.data.push({
          index: _i,
          date: dateTemp.getTime(),
          dateString: this.strtotime(`${dateTemp.getMonth() + 1}-${dateTemp.getDate()}-${dateTemp.getFullYear()}`),
        });
      }
    }
    _days._INI = dateINI;
    _days.dateEND = dateEND;
    return _days;
  }

  ngOnChanges(changes: any) {
    if (this._isInitialized) {
      if (!!changes.dateStart) {
        this.updateDatePickerSelector('start');
      } else if (!!changes.dateEnd) {
        this.updateDatePickerSelector('end');
      }
      console.log('this.updateDatePickerSelector()', changes);
    }

    // ***
    // console.log('change', changes);
    // changes.dateFilter;
    // this.dateStartChange.emit(this.datePipe.transform(this._dateStartSelected, this.dateFilter));
    // this.dateEndChange.emit(this.datePipe.transform(this._dateEndSelected, this.dateFilter));
  }
  public toggle() {
    if (this.floatingPickerState == false) {
       this.floatingPickerState = true;
       this.show();
     } else {
       this.floatingPickerState = false;
       this.hide();
     }
  }
  ngOnDestroy() {
    this.floatingPickerState = false;
    this.hide();
  }

}
@Directive({
  selector: '[ly-date-picker-trigger-for]',
})
export class LyDatePickerTriggerFor {
  @Input('ly-date-picker-trigger-for') lyDatePicker: DatePicker;
  constructor(private elementRef: ElementRef) {

  }
  @HostListener('click')
  handleClick() {
    // this.targetPosition();
    // this.lyDatePicker.rootMenu = this.targetPosition();
    this.lyDatePicker.toggle();

  }

  targetPosition() {
    let element: HTMLElement = this.elementRef.nativeElement;
    /*let _offset: any = offset(element);
    return {
      'width': element.offsetWidth,
      'height': element.offsetHeight,
      'left': _offset.left,
      'top': _offset.top,
    }*/

  }

}
@NgModule({
  imports: [CommonModule, FormsModule, LyRippleModule, LyButtonModule, LyShadowModule],
  exports: [DatePicker, LyButtonDatePicker, LyDatePickerTriggerFor, LyDatePickerContent],
  declarations: [DatePicker, YearPicker, LyButtonDatePicker, LyDatePickerTriggerFor, LyDatePickerContent],
  providers: [DatePipe],
})
export class LyDatePickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyDatePickerModule,
    };
  }
}
