import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyCommonModule } from '@alyle/ui';
import { LyFlexModule } from '@alyle/ui/flex';
import { FlexDemoOneComponent } from './flex-demo-one.component';
import { LyRadioModule } from '@alyle/ui/radio';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule,
    LyFlexModule,
    LyRadioModule
  ],
  exports: [FlexDemoOneComponent],
  declarations: [FlexDemoOneComponent]
})
export class FlexDemoOneModule { }
