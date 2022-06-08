import { Directive, ElementRef, forwardRef, Input, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { LyOverlay, OverlayFactory, StyleRenderer } from '@alyle/ui';
import { STYLES as FIELD_STYLES } from '@alyle/ui/field';
import { STYLES as AUTOCOMPLETE_STYLES } from './autocomplete-styles';
import type { LyAutocomplete } from './autocomplete';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';

/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * @docs-private
 */
export const LY_AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyAutocompleteTrigger),
  multi: true,
};

@Directive({
  selector: `input[lyAutocomplete], textarea[lyAutocomplete]`,
  host: {
    // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
    // a little earlier.
    '(focusin)': '_handleFocus()',
    '(blur)': '_onTouched()',
    '(input)': '_handleInput($event)',
    '(keydown)': '_handleKeydown($event)',
    '(click)': '_handleClick()',
  },
  exportAs: 'lyAutocompleteTrigger',
  providers: [
    LY_AUTOCOMPLETE_VALUE_ACCESSOR,
    StyleRenderer
  ],
})
export class LyAutocompleteTrigger {
  readonly classes = this.sRenderer.renderSheet(AUTOCOMPLETE_STYLES, 'trigger');

  private _overlayRef: OverlayFactory | null;

  /** The autocomplete panel to be attached to this trigger. */
  @Input('lyAutocomplete') autocomplete: LyAutocomplete;

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when autocomplete has been touched` */
  _onTouched = () => {};

  constructor(
    readonly sRenderer: StyleRenderer,
    private _element: ElementRef,
    private _overlay: LyOverlay,
    private _viewContainerRef: ViewContainerRef,
  ) {
    this.sRenderer.renderSheet(FIELD_STYLES, 'inputNative');
  }

  /** Opens the autocomplete suggestion panel. */
  openPanel(): void {
    this._attachOverlay();
  }

  _attachOverlay() {
    if (!this.autocomplete) {
      return;
    }
    let overlayRef = this._overlayRef;

    if (!overlayRef) {
      overlayRef = this._overlay.create(this.autocomplete.template, {
        $implicit: this,
        data: {}
      }, {
        styles: {
          top: 0,
          left: 0,
          pointerEvents: null
        },
        fnDestroy: this.detach.bind(this),
        hasBackdrop: false
      });
    } else {

    }
  }

  _handleFocus() {

  }

  _handleInput(_event: KeyboardEvent) {

  }

  _handleKeydown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    const hasModifier = hasModifierKey(event);
    if (keyCode === ESCAPE && !hasModifier) {
      event.preventDefault();
    }
  }

  _handleClick() {

  }

  // Implemented as part of ControlValueAccessor.
  writeValue(_value: any): void { }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => {}): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this._element.nativeElement.disabled = isDisabled;
  }

}
