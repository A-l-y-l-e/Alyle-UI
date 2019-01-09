import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyRadioModule } from '@alyle/ui/radio';
import { BasicRadioComponent } from './basic-radio.component';

@NgModule({
  imports: [
    CommonModule,
    LyRadioModule
  ],
  exports: [BasicRadioComponent],
  declarations: [BasicRadioComponent]
})
export class BasicRadioModule { }
