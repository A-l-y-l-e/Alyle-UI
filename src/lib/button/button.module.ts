// App
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButton, LyButtonRaised } from './button';
import { LyRippleModule } from 'alyle-ui/ripple';
import { LyShadowService } from 'alyle-ui/shadow';
import { LyIconButton } from 'alyle-ui/icon-button';

@NgModule({
  imports: [CommonModule, LyRippleModule],
  exports: [LyButton, LyButtonRaised],
  declarations: [LyButton, LyButtonRaised],
  providers: [LyShadowService],
})
export class LyButtonModule {}
