import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicUsesAvatarComponent } from './basic-uses-avatar.component';
import { LyAvatarModule } from '@alyle/ui/avatar';
import { LyIconModule } from '@alyle/ui/icon';
import { LyGridModule } from '@alyle/ui/grid';

@NgModule({
  imports: [
    CommonModule,
    LyAvatarModule,
    LyIconModule,
    LyGridModule
  ],
  exports: [BasicUsesAvatarComponent],
  declarations: [BasicUsesAvatarComponent]
})
export class BasicUsesAvatarModule { }
