import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyButton } from './button';

@NgModule({
  exports: [LyCommonModule, LyButton],
  declarations: [LyButton]
})
export class LyButtonModule { }
