import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicUsesAvatarComponent } from './basic-uses-avatar.component';
import { LyAvatarModule } from '@alyle/ui/avatar';

@NgModule({
  imports: [
    CommonModule,
    LyAvatarModule
  ],
  exports: [BasicUsesAvatarComponent],
  declarations: [BasicUsesAvatarComponent]
})
export class BasicUsesAvatarModule { }
