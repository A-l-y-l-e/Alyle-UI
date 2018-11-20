import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyButton } from './button';

@NgModule({
  exports: [LyButton, LyCommonModule],
  declarations: [LyButton]
})
export class LyButtonModule { }
