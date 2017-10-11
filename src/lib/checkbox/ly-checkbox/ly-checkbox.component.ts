import {
  Component,
  OnInit,
  AfterContentInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const LY_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyCheckbox),
  multi: true
};
export enum CheckboxState {
  /** The initial state. */
  Init,
  /** Checked state. */
  Checked,
  /** Unchecked state. */
  Unchecked,
  /** Indeterminate state. */
  Indeterminate,
};

@Component({
  selector: 'ly-checkbox',
  templateUrl: './ly-checkbox.component.html',
  styleUrls: ['./ly-checkbox.component.scss'],
  providers: [LY_CHECKBOX_CONTROL_VALUE_ACCESSOR]
})
export class LyCheckbox implements OnInit, AfterContentInit, ControlValueAccessor, OnChanges, OnDestroy {
  onTouched: () => any = () => {};
  private _currentCheckState: CheckboxState = CheckboxState.Init;
  @Input('id') id: string;
  @Input('attr.aria-label') ariaLabel: string;
  @Input('attr.aria-labelledby') ariaLabelledby: string;
  @Input('required') required: string;
  @Input('labelPosition') labelPosition: string;
  @Input('color') color: string;
  @Input('value') value: string;
  @Input('name') name: string;
  @Input('disabled') disabled: string;
  @Input('checked') checked = false;
  @Input('indeterminate') indeterminate: string;
  @Output('change') change: EventEmitter<any> = new EventEmitter<any>();
  @Output('indeterminateChange') indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _controlValueAccessorChangeFn: (value: any) => void = (value) => {};
  constructor() { }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
  }

  _onChangeEvent(event: Event) {
    event.stopPropagation();
  }
  _onInputClick(event: Event) {
    const ev = event.target as HTMLInputElement;
    this.checked = ev.checked;
    this._controlValueAccessorChangeFn(this.checked);
    console.log('_onInputClick', ev.checked);
  }

  writeValue(value: any) {
    this.checked = !!value;
    console.log('value', this.checked);
  }

  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    if (changes['src']) {
      // fn
    }
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  ngOnInit() {

  }

  ngAfterContentInit() {

  }
  ngOnDestroy() {

  }

}
