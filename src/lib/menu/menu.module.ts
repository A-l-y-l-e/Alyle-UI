import { LyMenu, LyMenuTriggerFor, LyMenuItem, LyMenuOpenOnHover } from './menu';
import { LyCommonModule, LyOverlayModule } from '@alyle/ui';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule, FormsModule, LyCommonModule, LyOverlayModule],
  exports: [LyMenu, LyMenuItem, LyMenuTriggerFor, LyMenuOpenOnHover],
  declarations: [LyMenu, LyMenuItem, LyMenuTriggerFor, LyMenuOpenOnHover],
})
export class LyMenuModule { }
