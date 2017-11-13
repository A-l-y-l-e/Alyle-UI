import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'input-example-04',
  templateUrl: './input-example-04.component.html',
  styleUrls: ['./input-example-04.component.css']
})
export class InputExample04Component {
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
           this.email.hasError('email') ? 'Not a valid email' :
           '';
  }

}
