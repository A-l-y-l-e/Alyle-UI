import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyDemoBasicComponent } from './typography-demo-basic.component';
import { LyTypographyModule } from '@alyle/ui/typography';

@NgModule({
  imports: [
    CommonModule,
    LyTypographyModule
  ],
  exports: [TypographyDemoBasicComponent],
  declarations: [TypographyDemoBasicComponent]
})
export class TypographyDemoBasicModule { }
