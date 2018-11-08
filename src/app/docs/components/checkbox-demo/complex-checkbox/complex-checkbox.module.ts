import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { ComplexCheckboxComponent } from './complex-checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LyCheckboxModule
  ],
  exports: [ComplexCheckboxComponent],
  declarations: [ComplexCheckboxComponent]
})
export class ComplexCheckboxModule { }
