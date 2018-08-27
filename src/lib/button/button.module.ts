// App
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyButton } from './button';
import { LyRippleModule } from '@alyle/ui/ripple';

@NgModule({
  imports: [CommonModule, LyRippleModule, LyCommonModule],
  exports: [LyButton, LyCommonModule],
  declarations: [LyButton]
})
export class LyButtonModule {}
