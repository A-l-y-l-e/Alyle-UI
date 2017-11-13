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
  ChangeDetectorRef,
  SimpleChange
} from '@angular/core';
import { FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

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

  ngOnChanges(changes: {[floatLabel: string]: SimpleChange}) {
    // if (!changes['placeholder'].firstChange) {
    //   console.log(JSON.stringify(changes['placeholder']))
    // }
  }

  ngOnDestroy() {
    this.focusState.complete();
  }
}
