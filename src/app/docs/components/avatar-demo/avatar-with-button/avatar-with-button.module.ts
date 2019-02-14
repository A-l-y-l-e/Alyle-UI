import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyAvatarModule } from '@alyle/ui/avatar';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
import { LyMenuModule } from '@alyle/ui/menu';

import { AvatarWithButtonComponent } from './avatar-with-button.component';

@NgModule({
  declarations: [AvatarWithButtonComponent],
  imports: [
    CommonModule,
    LyAvatarModule,
    LyGridModule,
    LyButtonModule,
    LyMenuModule
  ],
  exports: [AvatarWithButtonComponent]
})
export class AvatarWithButtonModule { }
