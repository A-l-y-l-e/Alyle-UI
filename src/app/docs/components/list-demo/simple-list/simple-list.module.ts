import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleListComponent } from './simple-list.component';
import { LyListModule } from '@alyle/ui/list';
import { LyAvatarModule } from '@alyle/ui/avatar';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyListModule,
    LyAvatarModule,
    LyIconModule
  ],
  exports: [SimpleListComponent],
  declarations: [SimpleListComponent]
})
export class SimpleListModule { }
