import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Self,
  Optional,
  OnChanges,
  SimpleChanges,
  SimpleChange } from '@angular/core';
import { FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Directive({
  selector: 'ly-input input, ly-textarea textarea'
})
export class LyFieldDirective implements OnChanges, OnDestroy {
  focusState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  focused: boolean;
  private _disabled = false;
  private _required = false;
  private _placeholder: string;
  @HostListener('focus', ['true']) focus(isFocused: boolean) {
    this.focusState.next(isFocused);
  }
  @HostListener('blur', ['false']) private _blur(isFocused: boolean) {
    this.focusState.next(isFocused);
  }
  @HostListener('input') private _noop() {

  }

  @Input()
  get disabled() { return this._ngControl ? this._ngControl.disabled : this._disabled; }
  set disabled(value: any) { this._disabled = !!(value); }
  @Input()
  get required() { return this._ngControl ? this._ngControl.invalid : this._required; }
  set required(value: any) { this._required = !!(value); }

  @Input() placeholder: string;
  @Input() type = 'text';
  // @Input()
  // get placeholder(): string {
  //   return this._placeholder;
  // }
  // set placeholder(val: string) {
  //   this._placeholder = val;
  // }

  @Input() floatLabel: string;

  constructor(
    public elementRef: ElementRef,
    @Optional() @Self() public _ngControl: NgControl,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective
  ) {
    this.elementRef.nativeElement.placeholder = '';
  }

  ngOnChanges(changes: {[floatLabel: string]: SimpleChange}) {
    // if (!changes['placeholder'].firstChange) {
    //   console.log(JSON.stringify(changes['placeholder']))
    // }
  }

  ngOnDestroy() {
    this.focusState.complete();
  }
}
