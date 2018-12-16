import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyListModule } from '@alyle/ui/list';
import { LyAvatarModule } from '@alyle/ui/avatar';
import { LyIconModule } from '@alyle/ui/icon';

import { FolderListComponent } from './folder-list.component';

@NgModule({
  imports: [
    CommonModule,
    LyListModule,
    LyAvatarModule,
    LyIconModule
  ],
  exports: [FolderListComponent],
  declarations: [FolderListComponent]
})
export class FolderListModule { }
