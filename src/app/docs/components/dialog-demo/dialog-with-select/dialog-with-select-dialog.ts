import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { LyDialogRef } from '@alyle/ui/dialog';

@Component({
  templateUrl: './dialog-with-select-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DialogWithSelectDialog {

  myForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(32)
    ]),
    option: new UntypedFormControl('', Validators.required)
  });

  get username() {
    return this.myForm.get('username')!;
  }

  constructor(
    public dialogRef: LyDialogRef
  ) { }

  onSubmit() {
    this.dialogRef.close(this.myForm.value);
  }
}
