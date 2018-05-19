import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyFlexModule } from '@alyle/ui/flex';
import { FlexDemoOneComponent } from './flex-demo-one.component';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyFlexModule
  ],
  exports: [FlexDemoOneComponent],
  declarations: [FlexDemoOneComponent]
})
export class FlexDemoOneModule { }
