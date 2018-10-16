import {
  Component,
  Input,
  forwardRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  Renderer2,
  ViewChild,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LyCoreStyles as LyCommonStyles, LyTheme2 } from '@alyle/ui';

/**
 * This allows it to support [(ngModel)].
 * @ignore
 */
export const LY_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyCheckbox),
  multi: true
};

/** Change event object emitted by LyCheckbox. */
export class LyCheckboxChange {
  /** The source LyCheckbox of the event. */
  source: LyCheckbox;
  /** The new `checked` value of the checkbox. */
  checked: boolean;
}

@Component({
  selector: 'ly-checkbox',
  templateUrl: 'checkbox.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LY_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  exportAs: 'lyCheckbox'
})
export class LyCheckbox implements ControlValueAccessor {

  /** The value attribute of the native input element */
  @Input() value: string;

  /** The native `<input type="checkbox">` element */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  constructor(
    public _commonStyles: LyCommonStyles,
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  _onInputChange(event: Event) {
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }
  _onInputClick(event: Event) {
    event.stopPropagation();
  }

}
