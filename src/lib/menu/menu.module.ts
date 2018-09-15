import { LyMenu, LyMenuTriggerFor, LyMenuItem } from './menu';
import { LyCommonModule, LxDomModule, LyOverlayModule } from '@alyle/ui';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule, FormsModule, LyCommonModule, LxDomModule, LyOverlayModule],
  exports: [LyMenu, LyMenuItem, LyMenuTriggerFor],
  declarations: [LyMenu, LyMenuItem, LyMenuTriggerFor],
})
export class LyMenuModule { }
