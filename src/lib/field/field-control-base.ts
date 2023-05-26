import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { StyleRenderer } from '@alyle/ui';

/** An interface which allows a control to work inside of a `LyField`. */
export abstract class LyFieldControlBase<T = any> {
  value: T | null;
  readonly stateChanges: Subject<void>;
  // private _form: NgForm | FormGroupDirective | null = this._parentForm || this._parentFormGroup;
  readonly errorState: boolean;
  readonly placeholder: string;
  readonly ngControl: NgControl | null;
  readonly focused: boolean;
  readonly empty: boolean;
  readonly disabled: boolean;
  readonly required: boolean;
  readonly floatingLabel: boolean;
  readonly sRenderer: StyleRenderer;
  /**
   * Whether the input is currently in an autofilled state. If the property is not present on the
   * control, it is assumed to be false.
   */
  readonly autofilled?: boolean;
  /** Handles a click on the control's container. */
  abstract onContainerClick?(event: MouseEvent): void;
}
