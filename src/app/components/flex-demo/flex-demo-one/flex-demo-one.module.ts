import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexDemoOneComponent } from './flex-demo-one.component';
import { LyFlexModule } from '@alyle/ui/flex';

@NgModule({
  imports: [
    CommonModule,
    LyFlexModule
  ],
  exports: [FlexDemoOneComponent],
  declarations: [FlexDemoOneComponent]
})
export class FlexDemoOneModule { }
