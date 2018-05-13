import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyRippleModule } from '@alyle/ui/ripple';
import { LyIconButton } from './icon-button';


@NgModule({
  imports: [CommonModule, LyRippleModule],
  exports: [LyIconButton],
  declarations: [LyIconButton],
})
export class LyIconButtonModule { }
