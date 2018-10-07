import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { BasicFieldComponent } from './basic-field.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyFieldModule
  ],
  exports: [BasicFieldComponent],
  declarations: [BasicFieldComponent]
})
export class BasicFieldModule { }
