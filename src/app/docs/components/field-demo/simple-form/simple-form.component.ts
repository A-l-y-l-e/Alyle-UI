import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  profileForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16)
    ]),
    bio: new FormControl('', [
      Validators.required,
      Validators.maxLength(256)
    ]),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required, Validators.email
    ]),
    option: new FormControl('', Validators.required)
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
