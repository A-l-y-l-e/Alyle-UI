import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyToolbar, ToolbarItem } from './toolbar';

@NgModule({
  imports: [CommonModule],
  exports: [LyToolbar, ToolbarItem],
  declarations: [LyToolbar, ToolbarItem]
})
export class LyToolbarModule { }
