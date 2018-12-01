import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuDemo01Component } from './menu-demo-01.component';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyTypographyModule } from '@alyle/ui/typography';

@NgModule({
  imports: [
    CommonModule,
    LyMenuModule,
    LyIconModule,
    LyButtonModule,
    LyTypographyModule
  ],
  exports: [MenuDemo01Component],
  declarations: [MenuDemo01Component]
})
export class MenuDemo01Module { }
