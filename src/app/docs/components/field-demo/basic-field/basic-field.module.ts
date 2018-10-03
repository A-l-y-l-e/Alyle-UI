import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicFieldComponent } from './basic-field.component';
import { LyFieldModule } from '@alyle/ui/field';

@NgModule({
  imports: [
    CommonModule,
    LyFieldModule
  ],
  exports: [BasicFieldComponent],
  declarations: [BasicFieldComponent]
})
export class BasicFieldModule { }
