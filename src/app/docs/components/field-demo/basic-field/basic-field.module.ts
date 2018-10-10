import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { BasicFieldComponent } from './basic-field.component';
import { LyRadioModule } from '@alyle/ui/radio';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LyFieldModule,
    LyRadioModule
  ],
  exports: [BasicFieldComponent],
  declarations: [BasicFieldComponent]
})
export class BasicFieldModule { }
