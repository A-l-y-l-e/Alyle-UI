import { lyl, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { STYLES as RADIO_STYLES } from '@alyle/ui/radio';
import { STYLES as CHECKBOX_STYLES } from '@alyle/ui/checkbox';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

export const STYLES = (_: ThemeVariables, ref: ThemeRef) => {
  const radio = ref.renderStyleSheet(RADIO_STYLES);
  const checkbox = ref.renderStyleSheet(CHECKBOX_STYLES);
  return {
    exampleContainer: lyl `{
      > * {
        margin: 8px 0
      }
      .${radio.radio},
      .${checkbox.root} {
        margin: 0 12px
      }
    }`
  };
};

@Component({
  selector: 'aui-field-playground',
  templateUrl: './field-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ],
  standalone: false
})
export class FieldPlaygroundComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES);
  hide = true;
  appearance = new UntypedFormControl();
  color = new UntypedFormControl('primary');
  isReadonly = new UntypedFormControl();
  isDisabled = new UntypedFormControl();
  password = new UntypedFormControl('', [Validators.required, Validators.minLength(8)]);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
