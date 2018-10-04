import { Directive, ElementRef, Optional, Self, Input, HostListener, HostBinding } from '@angular/core';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { toBoolean } from '@alyle/ui';

@Directive({
  selector: 'ly-field > input, ly-field > textarea',
  exportAs: 'lyInput'
})
export class LyInputNative {
  /** @ignore */
  _hostElement: HTMLInputElement | HTMLTextAreaElement;
  protected _disabled = false;
  protected _required = false;

  @HostListener('input') _onInput() { }

  @Input()
  set value(val) {
    if (val !== this.value) {
      this._hostElement.value = val;
    }
  }
  get value() {
    return this._hostElement.value;
  }

  @HostBinding()
  @Input()
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
  }
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  @HostBinding()
  @Input()
  set required(value: boolean) {
    this._required = toBoolean(value);
  }
  get required(): boolean { return this._required; }

  constructor(
    private _el: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    /** @ignore */
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
  ) {
    this._hostElement = this._el.nativeElement;
  }

  /** Focuses the input. */
  focus(): void { this._hostElement.focus(); }

}
