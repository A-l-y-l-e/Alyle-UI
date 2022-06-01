import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCheckboxModule } from '@alyle/ui/checkbox';

import { CheckboxReactiveFormsExampleComponent } from './checkbox-reactive-forms-example.component';



@NgModule({
  declarations: [
    CheckboxReactiveFormsExampleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyButtonModule,
    LyCheckboxModule
  ]
})
export class CheckboxReactiveFormsExampleModule { }
