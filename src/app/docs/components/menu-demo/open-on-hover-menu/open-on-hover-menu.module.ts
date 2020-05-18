import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenOnHoverMenuComponent } from './open-on-hover-menu.component';
import { LyButtonModule } from '@alyle/ui/button';
import { LyMenuModule } from '@alyle/ui/menu';



@NgModule({
  declarations: [OpenOnHoverMenuComponent],
  imports: [
    CommonModule,
    LyButtonModule,
    LyMenuModule
  ],
  exports: [OpenOnHoverMenuComponent]
})
export class OpenOnHoverMenuModule { }
