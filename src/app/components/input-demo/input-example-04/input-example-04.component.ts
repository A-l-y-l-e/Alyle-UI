import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'input-example-04',
  templateUrl: './input-example-04.component.html',
  styleUrls: ['./input-example-04.component.css']
})
export class InputExample04Component {
  exampleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.exampleForm = this.fb.group({
      email: ['value invalid', [Validators.required, Validators.email]]
    });
  }

  getErrorMessage() {
    const email = this.exampleForm.get('email');
    return email.hasError('required') ? 'You must enter a value' :
           email.hasError('email') ? 'Not a valid email' :
           '';
  }

}
