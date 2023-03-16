import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '320px'
  }
});

@Component({
  selector: 'aui-simple-form',
  templateUrl: './simple-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleFormComponent {
  readonly classes = this.theme.addStyleSheet(STYLES);

  profileForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16)
    ]),
    bio: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(256)
    ]),
    phone: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [
      Validators.required, Validators.email
    ]),
    option: new UntypedFormControl('', Validators.required)
  });

  get username() {
    return this.profileForm.get('username')!;
  }

  get bio() {
    return this.profileForm.get('bio')!;
  }

  constructor(private theme: LyTheme2) { }

  onSubmit() {
    console.warn(this.profileForm.value);
  }
}
