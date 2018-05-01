import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { IconButtonExample01Component } from './icon-button-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyIconButtonModule
  ],
  exports: [IconButtonExample01Component],
  declarations: [IconButtonExample01Component]
})
export class IconButtonExample01Module { }
