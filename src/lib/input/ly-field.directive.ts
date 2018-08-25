import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Self,
  Optional,
  OnChanges,
  ChangeDetectorRef,
  SimpleChange
} from '@angular/core';
import { FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: 'ly-input input, ly-textarea textarea'
})
export class LyFieldDirective implements OnChanges, OnDestroy {
  focusState: Subject<boolean> = new Subject();
  focused: boolean;
  private _disabled = false;
  private _required = false;
  private _placeholder: string;
  @Input() type: string;
  @HostListener('focus', ['true']) focus(isFocused: boolean) {
    this.focusState.next(isFocused);
  }
  @HostListener('blur', ['false']) private _blur(isFocused: boolean) {
    this.focusState.next(isFocused);
  }
  @HostListener('input') private _noop() { }

  @Input()
  get disabled() { return this._ngControl ? this._ngControl.disabled : this._disabled; }
  set disabled(value: any) { this._disabled = !!(value); }
  @Input()
  get required() { return this._ngControl ? this._ngControl.invalid : this._required; }
  set required(value: any) { this._required = !!(value); }

  constructor(
    public elementRef: ElementRef,
    @Optional() @Self() public _ngControl: NgControl,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective,
    private cd: ChangeDetectorRef
  ) {}
  markForCheck() {
    this.cd.markForCheck();
  }

  _parent(): any {
    return this._parentFormGroup || this._parentForm;
  }
  protected _updateErrorState() {
    // const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    // const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
    const control = this._ngControl ? this._ngControl.control as FormControl : null;
    // const newState = matcher.isErrorState(control, parent);

    // if (newState !== oldState) {
    //   this.errorState = newState;
    //   this.stateChanges.next();
    // }
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
