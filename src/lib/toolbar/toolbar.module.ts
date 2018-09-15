import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyToolbar, ToolbarItem, LyToolbarRow } from './toolbar';

@NgModule({
  imports: [CommonModule],
  exports: [LyToolbar, ToolbarItem, LyToolbarRow],
  declarations: [LyToolbar, ToolbarItem, LyToolbarRow]
})
export class LyToolbarModule { }
