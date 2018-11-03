import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasicCheckboxComponent } from './basic-checkbox.component';
import { LyCheckboxModule } from '@alyle/ui/checkbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCheckboxModule
  ],
  exports: [BasicCheckboxComponent],
  declarations: [BasicCheckboxComponent]
})
export class BasicCheckboxModule { }
