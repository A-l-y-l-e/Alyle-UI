import { CommonModule } from '@angular/common';
import { LyTypographyModule } from '@alyle/ui/typography';
import { NgModule } from '@angular/core';
import { TypographyDemoBasicComponent } from './typography-demo-basic.component';

@NgModule({
  imports: [
    CommonModule,
    LyTypographyModule
  ],
  exports: [TypographyDemoBasicComponent],
  declarations: [TypographyDemoBasicComponent]
})
export class TypographyDemoBasicModule { }
