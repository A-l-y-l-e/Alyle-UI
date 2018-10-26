import { Directive, ElementRef, Optional, Self, Input, HostListener, HostBinding, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { toBoolean } from '@alyle/ui';
import { Subject } from 'rxjs';

/** @ignore */
const ATTR_PLACEHOLDER = 'placeholder';

@Directive({
  selector: 'ly-field > input, ly-field > textarea',
  exportAs: 'lyInput'
})
export class LyInputNative implements OnInit, OnDestroy {
  /** @ignore */
  _hostElement: HTMLInputElement | HTMLTextAreaElement;
  protected _disabled = false;
  protected _required = false;
  protected _placeholder: string;
  readonly stateChanges: Subject<void> = new Subject<void>();
  focused: boolean = false;

  @HostListener('input') _onInput() {
    this.stateChanges.next();
  }

  @HostListener('blur') _onBlur() {
    if (this.focused !== false) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  @HostListener('focus') _onFocus() {
    if (this.focused !== true) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  /** @ignore */
  @Input()
  set value(val) {
    if (val !== this.value) {
      this._hostElement.value = val;
      this.stateChanges.next();
    }
  }
  get value() {
    return this._hostElement.value;
  }

  /** Whether the input is disabled. */
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

  @Input()
  set placeholder(val: string) {
    this._placeholder = val;
  }
  get placeholder(): string { return this._placeholder; }

  constructor(
    private _el: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private _renderer: Renderer2,
    /** @ignore */
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective
  ) {
    this._hostElement = this._el.nativeElement;
  }

  ngOnInit() {
    this._renderer.setAttribute(this._hostElement, ATTR_PLACEHOLDER, '­');
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  /** Focuses the input. */
  focus(): void { this._hostElement.focus(); }

}
