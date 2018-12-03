import { NgModule } from '@angular/core';
import { LyCommonModule } from '@alyle/ui';
import { LyAvatar } from './avatar';

@NgModule({
  exports: [LyAvatar, LyCommonModule],
  declarations: [LyAvatar]
})
export class LyAvatarModule { }
