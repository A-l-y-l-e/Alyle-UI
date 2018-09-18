import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarBasicDemoComponent } from './toolbar-basic-demo.component';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';

@NgModule({
  imports: [
    CommonModule,
    LyToolbarModule,
    LyTypographyModule
  ],
  exports: [ToolbarBasicDemoComponent],
  declarations: [ToolbarBasicDemoComponent]
})
export class ToolbarBasicDemoModule { }
