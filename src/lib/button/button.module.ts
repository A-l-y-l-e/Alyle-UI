import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyButton, LyAnchor } from './button';

@NgModule({
  exports: [LyCommonModule, LyButton, LyAnchor],
  declarations: [LyButton, LyAnchor]
})
export class LyButtonModule { }
