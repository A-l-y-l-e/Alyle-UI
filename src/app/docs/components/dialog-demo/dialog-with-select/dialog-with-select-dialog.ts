import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LyDialogRef } from '@alyle/ui/dialog';

@Component({
  templateUrl: './dialog-with-select-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogWithSelectDialog {

  myForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16)
    ]),
    option: new FormControl('', Validators.required)
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
